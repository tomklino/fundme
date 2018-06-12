<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div id="center_bar">
      <!-- <ProjectList/> -->
      <ProjectAboutBox v-bind:project="frenchblog"></ProjectAboutBox>
    </div>
  </div>
</template>

<script>
import ProjectList from './components/ProjectList'
import ProjectAboutBox from './components/ProjectAboutBox'

export default {
  name: 'App',
  created() {
    fetch('api/project/frenchblog/about')
      .then(response => response.json())
      .then(data => this.frenchblog.about = data.about)
  },
  data () {
    return {
      frenchblog: {
        about: "hello, I am frenchblog"
      }
    }
  },
  components: {
    ProjectList,
    ProjectAboutBox
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
