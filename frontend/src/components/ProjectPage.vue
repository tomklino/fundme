<template>
  <div class="projectPage">
    <h1 class="projectTitle">{{project.name}}</h1>
    <div class="description">{{project.description}}
    </div>
    <ChallengeList></ChallengeList>
    <v-flex x12>
      <v-btn block depressed color="info"
        :to="{
          name: 'add_challenge',
          params: {
            project_id
          }
        }">
          Add new challenge
      </v-btn>
    </v-flex>
  </div>
</template>

<script>
import { PROJECT_QUERY_BY_ID } from '@/graphql'
import ChallengeList from '@/components/ChallengeList'

export default {
  name: 'ProjectPage',
  components: {
    ChallengeList
  },
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
  .projectPage {
    width: 600px;
  }

  .projectTitle{
    font-size: 40px;
  }

</style>
