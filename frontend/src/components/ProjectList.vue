<template>
  <ul>
    <li v-for="project in projects">
      <span>{{ project.name }}</span>
      <span v-if="project.online_repo">
        <a v-bind:href=project.online_repo>
        <img src="../assets/git.svg">
      </a>
      </span>
    </li>
  </ul>
</template>

<script>
import { PROJECT_QUERY } from '@/graphql'

export default {
  name: 'ProjectList',
  // created() {
  //   fetch('api/projects_list')
  //     .then(response => response.json())
  //     .then(data => this.projects = data)
  // },
  data () {
    return {
      project_query: "test",
      projects: []
    }
  },
  apollo: {
    projects: {
      query: PROJECT_QUERY,
      variables () {
        return {
          name: this.project_query
        }
      }
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
