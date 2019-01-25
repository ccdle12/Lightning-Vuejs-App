// const { gql } = require('apollo-server-express');

// typeDefs define the structs (types) used in GraphQL
// and the functions that can be called by the client
// to either Mutate (PUT, POST, DELETE) or Query (GET).
const typeDefs = `
  type User {
    address: String!,
    balance: Int
  }

  type Invoice {
    boltInvoice: String!,
    QRCodeUrl: String!
  }

  type InvoicePaidResponse {
    paid: Boolean,
    boltInvoice: String,
    value: Int
  }

  type Query {
    user: User
  }

  type Mutation {
    generateInvoice(amount: Int): Invoice
  }

  type Subscription {
    invoicePaid(boltInvoice: String): InvoicePaidResponse
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = { typeDefs };
