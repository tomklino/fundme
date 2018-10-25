<template>
  <div class="projectPage">
    <h1 class="projectTitle">{{project.name}}</h1>
    <div class="description">{{project.description}}
    </div>
    <ChallengeList ref="challengesList"></ChallengeList>
    <v-flex x12>
      <v-btn block depressed color="info"
        @click="add_new_challenge_dialog = true">
          Add new challenge
      </v-btn>
    </v-flex>
    <v-dialog max-width="600" v-model="add_new_challenge_dialog">
      <AddChallenge v-on:submitted="onSubmit"></AddChallenge>
    </v-dialog>
  </div>
</template>

<script>
import { PROJECT_QUERY_BY_ID } from '@/graphql'
import ChallengeList from '@/components/ChallengeList'
import AddChallenge from '@/components/AddChallenge'

export default {
  name: 'ProjectPage',
  components: {
    ChallengeList,
    AddChallenge
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
      add_new_challenge_dialog: false,
      ...this.$route.params
    }
  },

  methods: {
    onSubmit() {
       this.$refs.challengesList.fetchChallenges();
       this.add_new_challenge_dialog = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .projectPage {
    width: 824px;
  }

  .projectTitle{
    font-size: 40px;
  }

</style>
