// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import App from './App'

Vue.config.productionTip = false
Vue.use(VueRouter)

/* eslint-disable no-new */
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/project/:project_id', component: App }
  ]
})

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql'
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

new Vue({
  el: '#app',
  router,
  provide: apolloProvider.provide(),
  components: { App },
  template: '<App/>'
})
