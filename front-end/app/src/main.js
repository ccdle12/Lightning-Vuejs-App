import Vue from "vue"
import App from "./App.vue"
import VueApollo from "vue-apollo"
import { routes } from './routes'
import VueRouter from 'vue-router'
import { ApolloClient } from "apollo-boost"
import BootstrapVue from 'bootstrap-vue'

// NOTE - TESTING SETTING UP CLIENT SIDE SUBSCRIPTIONS
import { WebSocketLink } from "apollo-link-ws"
// import { SubscriptionClient } from "subscriptions-transport-ws"
import { HttpLink }  from "apollo-link-http"
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'

const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription',
  )

const link = ApolloLink.split(
  hasSubscriptionOperation, 
  new WebSocketLink({
    uri: 'ws://localhost:3000/graphql',
    options: {
      timeout: 60000,
      reconnect: true 
    },
  }),
  new HttpLink({
      uri: 'http://localhost:3000/graphql',
  }),
)

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const router = new VueRouter({
  routes,
  mode: 'history'
})

Vue.config.productionTip = false;
Vue.use(VueApollo);
Vue.use(VueRouter)
Vue.use(BootstrapVue);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});


new Vue({
  // inject apolloProvider here like vue-router or vuex
  render: h => h(App),
  router,
  apolloProvider,
}).$mount("#app")
