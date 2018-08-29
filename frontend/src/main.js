// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App'
import AddProject from '@/components/AddProject.vue'
import ProjectList from '@/components/ProjectList.vue'
import ProjectPage from '@/components/ProjectPage.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

/* eslint-disable no-new */
//TODO routing should be imported from a seperate file
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProjectList
    },
    {
      path: '/addproject',
      name: 'Add_Project',
      component: AddProject
    },
    {
      path: '/project/:project_id',
      name: 'project',
      component: ProjectPage
    }
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

Vue.use(Vuetify)

const sourceOfTruth = {
  username: null
}

new Vue({
  el: '#app',
  router,
  data: sourceOfTruth,
  provide: apolloProvider.provide(),
  components: { App },
  template: '<App/>'
})
