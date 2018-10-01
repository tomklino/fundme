<template>
  <div>
    <h1>{{project.name}}</h1>
    <v-btn flat primary
      :to="{
        name: 'add_challenge',
        params: {
          project_id
        }
      }">
        <v-icon>note_add</v-icon>
    </v-btn>
    <div class="description">{{project.description}}
    </div>
  </div>
</template>

<script>
import { PROJECT_QUERY_BY_ID } from '@/graphql'

export default {
  name: 'ProjectPage',
  mounted () {
    console.dir(this.$route.params['project_id'])
    this.$apollo.query({
      query: PROJECT_QUERY_BY_ID,
      variables: {
        id: this.$route.params['project_id']
      }
    }).then(({ data }) => {
      this.project = data.projects[0];
      console.dir(this.project)
    })
  },
  data () {
    return {
      project: {},
      ...this.$route.params
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
