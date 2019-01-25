<template>
  <div class="hello">
    <p>{{ invoice }}</p>
    <img :src="QRCodeUrl" />
  </div>
</template>

<script>

import gql from 'graphql-tag'

export default {
  // |-------- Data --------|
  data: function() {
    return {
      invoice: "",
      QRCodeUrl: "",
    }
  },
  
  // |-------- Life Cycle Hooks --------|
  created: function() {
      this.generateInvoice();
  },

  apollo: {
  // Subscriptions
  $subscribe: {
    // When a tag is added
    invoicePaid: {
      query: gql`subscription invoicePaid($boltInvoice: String) {
        invoicePaid(boltInvoice: $boltInvoice) {
          paid
          boltInvoice
          value
        }
      }`,
      // Reactive variables
      variables () {
        // This works just like regular queries
        // and will re-subscribe with the right variables
        // each time the values change
        return {
          boltInvoice: "asdfsdaF",
        }
      },
      // Result hook
      result (data) {
        let resultStr = JSON.stringify(data);
        let resultJSON = JSON.parse(resultStr);
        console.log(resultJSON["data"]["invoicePaid"]["paid"]);
        this.invoice = resultJSON["data"]["invoicePaid"]["paid"];
      },
    },
  },
},

  // |-------- Methods --------|
  methods: {
    generateInvoice: async function() {
      // Send a mutation request to generate an Invoice.
      let res = await this.$apollo.mutate({
        mutation: gql`mutation ($amount: Int) {
          generateInvoice(amount: $amount) {
            boltInvoice,
            QRCodeUrl
          }
        }`
      });
      
      // Extract the response.
      let boltInvoice = res.data.generateInvoice.boltInvoice;
      let QRCodeUrl = res.data.generateInvoice.QRCodeUrl;
      
      // Assign to the view.
      this.invoice = boltInvoice;
      this.QRCodeUrl = QRCodeUrl;

      // TEMP: (ccdle12) testing if this works.
      // this.subscribeToInvoice();
      const query = gql`subscription invoicePaid {
        invoicePaid {
          paid
          boltInvoice
          value
        }
      }`
  },
},
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
