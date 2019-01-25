import Vue from "vue"
import App from "./App.vue"
import VueApollo from "vue-apollo"

import { ApolloClient } from "apollo-boost"

// NOTE - TESTING SETTING UP CLIENT SIDE SUBSCRIPTIONS
import { WebSocketLink } from "apollo-link-ws"
import { SubscriptionClient } from "subscriptions-transport-ws"
import { HttpLink }  from "apollo-link-http"
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'

// TEMP: (ccdle12)
// const httpLink = new HttpLink({ uri: "http://localhost:3000/graphql" });
// const wsClient = new SubscriptionClient("ws://localhost:3000/graphql", {
    // reconnect: true
// });
// const wsLink = new WebSocketLink(wsClient);

// const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  // TEMP: (ccdle12)
    // uri: "http://localhost:3000/graphql"
  // }),
    // defaultClient: httpLink,
  // wsLink,
  // connectToDevTools: true,
// });
//
const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription',
  )

const link = ApolloLink.split(
  hasSubscriptionOperation, 
  new WebSocketLink({
    uri: 'ws://localhost:3000/graphql',
    options: { reconnect: true },
  }),
  new HttpLink({
      uri: 'http://localhost:3000/graphql',
  }),
)

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

Vue.config.productionTip = false;
Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

new Vue({
  // inject apolloProvider here like vue-router or vuex
  apolloProvider,
  render: h => h(App),
}).$mount("#app")
