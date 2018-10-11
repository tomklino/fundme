<template>
  <v-app id="inspire">
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-title>Voost.io</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="$root.$data.username"
          flat :to=" { name: 'Add_Project' }">
          <v-icon>add_circle</v-icon>
        </v-btn>
        <v-btn flat :to=" { name: 'home' }">
          <v-icon>home</v-icon>
        </v-btn>
        <SignInWithGithub
          github_clientid="5c6f1bd40f1841f1674a"
          v-on:user-signed-in="onUserSignin"
          v-bind:logged_in_user="$root.$data.username"/>
        <LogoutButton v-if="$root.$data.isUserLoggedIn"/>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
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

export default {
  name: 'App',
  created() {
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
      drawer: true
    }
  },
  props: {
    source: String
  },
  components: {
    SignInWithGithub,
    LogoutButton
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
</style>
