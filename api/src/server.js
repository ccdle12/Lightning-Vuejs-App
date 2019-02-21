const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql-schemas").typeDefs;
const resolvers = require("./graphql-resolvers").resolvers;
const { createServer } = require("http");
const app = express();

module.exports = function() {
  app.use(bodyParser.json());

  // Create an instance of the ApolloServer including the ability to listen to
  // subscriptions.
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: () => console.log("Connected to websocket"),
    },
  });

  apolloServer.applyMiddleware({ app });
  
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  
  // Return app this can be used in index.js and
  // in integration tests.
  return { httpServer };
};
