<template>
  <v-app id="inspire">
    <v-toolbar color="indigo" dark fixed app>
      <router-link :to=" { name: 'home' }" tag="div" class="logo">
        <v-toolbar-title>Voost.io</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <CouponWallet v-if="$root.$data.username"></CouponWallet>
        <v-btn v-if="$root.$data.username"
          flat :to=" { name: 'Add_Project' }">
          <v-icon>add_circle</v-icon>
          <span>&nbsp;Add project</span>
        </v-btn>
        <SignInWithGithub
          :github_clientid="github_clientid"
          :github_redirect_uri="github_redirect_uri"
          v-on:user-signed-in="onUserSignin"
          v-bind:logged_in_user="$root.$data.username"/>
        <LogoutButton v-if="$root.$data.isUserLoggedIn"/>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
        <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import ProjectList from '@/components/ProjectList'
import ProjectAboutBox from '@/components/ProjectAboutBox'
import SignInWithGithub from '@/components/SignInWithGithub'
import LogoutButton from '@/components/LogoutButton'
import CouponWallet from '@/components/CouponWallet'
import { prod, dev } from '@/config.js'

const config = process.env['NODE_ENV'] === "production" ? prod : dev

export default {
  name: 'App',
  created() {
    console.log(process.env['NODE_ENV'] === "production" ? "production!!!" : "development!@!@")
    let url = new URL(window.location)
    let hostname = "http://" + url.hostname + (url.port !== 80 ? `:${url.port}` : '')
  },
  methods: {
    onUserSignin: function(user_ids) {
      this.$root.$data.isUserLoggedIn = true;
      this.$root.$data.username = user_ids.github_username;
      this.$root.$data.user_id = user_ids.user_id;
    }
  },
  data () {
    return {
      username: null,
      frenchblog: {},
      drawer: true,
      github_clientid: config.github_clientid,
      github_redirect_uri: config.github_redirect_uri
    }
  },
  props: {
    source: String
  },
  components: {
    SignInWithGithub,
    LogoutButton,
    CouponWallet
  }
}
</script>

<style>
#center_bar {
  max-width: 975px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  cursor: pointer;
}



</style>
