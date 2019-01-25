const lnClient = require("../lightning-client/client").Client;
const utils = require("../utils");
const QRCode = require("qrcode");
// NOTE: (ccdle12) I don't seem to be using withFilter.
const { PubSub, withFilter } = require("graphql-subscriptions");

// Initialize pubsub to be used in event emission.
const pubsub = new PubSub();

const resolvers = {
  // Query is the equivalent to GET Requests.
  Query: {
    async user(obj, args, context) {
        if(!context.req.session.user) {
            throw "You must be logged in";
        }
        return { address: context.req.session.user.address, balance: 0 }
    }
  },

  // Mutation is the equivalent to PUT, POST, DELETE.
  Mutation: {
    async generateInvoice(obj, args, context) {
      // TODO: (ccdle12) receive the invoice amount from the front end.
      let invoiceAmt = {value: 100}
      let invoiceRes = await addInvoice(invoiceAmt);  

      // Parse the invoice as JSON and retrieve the payment_request.
      let invoiceObj = utils.objToJSON(invoiceRes);
      let boltInvoice = invoiceObj["payment_request"];
      
      // This can be still be used after the call is returned, unlike RUST or
      // golang, the function call will still run in memory after leaving the
      // scope of this function.
      subscribeInvoice(boltInvoice);
      
      // Generate a QR Code for the payment request
      let code = await QRCode.toDataURL(boltInvoice);

      return { boltInvoice: boltInvoice, QRCodeUrl: code };
    }
  },

  // Subscriptions - used for client <---> server side streaming, can send push
  // updates to the client from the server according to certain events.
  Subscription: {
    invoicePaid: {
      // TODO: (ccdle12) Move INVOICE_PAID to utils as a const.
      subscribe: () => pubsub.asyncIterator([utils.INVOICE_PAID]),
    },
  }
};

// TODO: (ccdle12) MOVE THESE TO ANOTHER FOLDER
// NOTE: (ccdle12) It seems like generated gRPC functions that are created with
// callbacks, don"t like being used in async/await out of the box. Thats why
// I"ve wrapped it in a promise.
function addInvoice(invoiceAmt) {
  return new Promise((resolve, reject) => {
    lnClient.AddInvoice(invoiceAmt, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  });
}

// subscribeInvoice  will listen to invoice events ocurring in LND.
// Specifically it will check each invoice event in LND and check whether it
// matches the BOLT Invoice passed and whether if it has been paid.
// NOTE: (ccdle12) this is still in a naive stage of implementation.
function subscribeInvoice(boltInvoice) {
    // Create a request to subscribe to any invoices.
    var request = { 
      add_index: 0,
      settle_index: 0,
    };

    // TODO: (ccdle12) this logic needs to be improved.
    var call = lnClient.subscribeInvoices(request);
    call.on("data", function(response) {
      // Parse the response from subscribing to Invoices.
      recvPaymentReq = response["payment_request"];
      isInvoiceSettled = response["settled"];
      value = response["value"];

      // Check if the receiving invoice is a generated one and if it has been
      // paid.
      if ( recvPaymentReq == boltInvoice && isInvoiceSettled ) {
        // Emit the event that the invoice has been paid!
        pubsub.publish(utils.INVOICE_PAID, { invoicePaid: { 
            paid: true, 
            boltInvoice: boltInvoice, 
            value: value }
        });
      }
    });

    call.on("status", function(status) {
      // The current status of the stream.
    });

    call.on("end", function() {
      // The server has closed the stream.
    });
}

module.exports = { resolvers };
