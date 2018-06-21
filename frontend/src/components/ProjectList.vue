<template>
  <div>
    <form method="POST" @submit.prevent="searchProjects">
      <input type="text" v-model="project_query" >
      <input type="submit" value="Search"></input>
    </form>
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
  </div>
</template>

<script>
import { PROJECT_QUERY } from '@/graphql'

export default {
  name: 'ProjectList',
  data () {
    return {
      project_query: "",
      projects: []
    }
  },
  methods: {
    searchProjects(event) {
      console.log(`name is ${this.project_query}`)
      this.$apollo.query({
        query: PROJECT_QUERY,
        variables: {
          name: this.project_query
        }
      }).then(({data}) => {
        console.dir(data)
        this.projects = data.projects
      })
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
