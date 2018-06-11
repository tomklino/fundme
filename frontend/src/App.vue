<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div id="center_bar">
      <ProjectList/>
    </div>
  </div>
</template>

<script>
import ProjectList from './components/ProjectList'

export default {
  name: 'App',
  components: {
    ProjectList
  }
}
</script>

<style>
#center_bar {
  max-width: 600px;
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
