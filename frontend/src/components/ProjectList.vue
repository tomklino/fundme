<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex v-for="project in projects" xs4 :key="project.id">
        <v-card ripple tag="div" height=230 class="projectCard"
        :color="pseudoRandomColor(project.id)" :to="{
          name: 'project',
          params: {
            project_id: project.id
          }
        }"
        >
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{project.name}}</h3>
              <div class="description">{{project.description}}</div>
              <div class="username blue-grey--text text--darken-2">{{project.owner.username}}</div>
            </div>
          </v-card-title>
          <v-card-actions class="actions">
            <v-btn v-on:click="(e) => e.stopPropagation()" v-if="project.online_repo" :href="project.online_repo" depressed color="secondary">See in Github</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { PROJECT_QUERY } from '@/graphql'

export default {
  name: 'ProjectList',
  mounted () {
    this.searchProjects();
  },
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
        query: PROJECT_QUERY
      }).then(({ data }) => {
        console.log(JSON.stringify(data))
        this.projects = data.projects
      })
    },
    pseudoRandomColor(seed) {
      return "cyan lighten-1";
    }
  }
}
</script>

<style scoped>
.description {

}
.username {
  padding-top: 18px;
  font-size: 14px;
}

.projectCard:hover{
  opacity: 0.8;
  cursor: pointer;
}

.projectCard{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.actions{
  flex-direction: row-reverse;
}
</style>
