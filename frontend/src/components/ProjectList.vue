<template>
  <ul>
    <li v-for="project in projects">
      <span>{{ project.name }}</span>
      <span v-if="project.onlineRepo">
        <a v-bind:href=project.onlineRepo>
        <img src="../assets/git.svg">
      </a>
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ProjectList',
  data () {
    return {
      projects: [
        {name: "imhere"},
        {name: "frenchblog", onlineRepo: "https://github.com/tomklino/frenchblog"},
        {name: "friendly", onlineRepo: "https://github.com/tomklino/friendly"}
      ]
    }
  }
}
</script>

<style scoped>
li {
  width: auto;
  position: relative;
  list-style-type: none;
  background-color: #9bbcf2;
  padding: 5px;
  height: 25px;
  border-top: 1px solid;
  border-color: #77818e;
}

li:last-child {
  border-bottom: 1px solid;
  border-color: #77818e;
}

li:hover {
  background-color: #81a6e2;
  cursor: pointer;
}

li > span:first-child {
  float: left;
  padding: 3px;
}

li > span {
  float: right;
}

img {
  width: 25px;
  height: 25px;
}
</style>
