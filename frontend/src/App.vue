<template>
  <v-app id="inspire">
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat :to=" { name: 'Add_Project' }">
          <v-icon>add_circle</v-icon>
        </v-btn>
        <v-btn flat :to=" { name: 'landing' }">
          <v-icon>home</v-icon>
        </v-btn>
        <SignInWithGithub />
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
import ProjectList from './components/ProjectList'
import ProjectAboutBox from './components/ProjectAboutBox'
import SignInWithGithub from './components/SignInWithGithub'

export default {
  name: 'App',
  created() {
    let url = new URL(window.location)
    let hostname = "http://" + url.hostname + (url.port !== 80 ? `:${url.port}` : '')
  },
  data () {
    return {
      frenchblog: {},
      drawer: true
    }
  },
  props: {
    source: String
  },
  components: {
    ProjectList,
    ProjectAboutBox,
    SignInWithGithub
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
