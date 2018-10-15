<template>
  <v-list>
    <v-list-tile
      v-for="challenge in challenges"
      :key="challenge.title"
      avatar
      @click=""
    >
      <v-list-tile-action>
        <v-icon v-if="challenge.challenge_type === 'Feature'" color="cyan 100">star</v-icon>
        <v-icon v-if="challenge.challenge_type === 'Bug'" color="lime 500">bug_report</v-icon>
      </v-list-tile-action>

      <v-list-tile-content>
        <v-list-tile-title v-text="challenge.name"></v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-content>
        <v-btn v-if="challenge.assignee === null" @click="assignToMe(challenge.id)">Assign to me</v-btn>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import { CHALLENGE_QUERY, ASSIGN_CHALLENGE_TO_USER } from '@/graphql'

export default {
  name: 'ChallengeList',
  mounted () {
    console.log("ChallengeList mounted")
    this.searchChallenges();
  },
  data () {
    return {
      challenges: []
    }
  },
  methods: {
    searchChallenges(event) {
      this.$apollo.query({
        query: CHALLENGE_QUERY,
        variables: {
          project_id: this.$route.params['project_id']
        }
      }).then(({ data }) => {
        console.log(JSON.stringify(data))
        this.challenges = data.challenges;
      })
    },
    assignToMe(id) {
      this.$apollo.mutate({
        mutation: ASSIGN_CHALLENGE_TO_USER,
        variables: {
          challenge_id: id,
          assignee: this.$root.$data.user_id
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
          query: CHALLENGE_QUERY,
          variables: {
            project_id: this.$route.params.project_id
          }
        }]
      }).then((data) => {
        console.log("assigned to user:", data)
        this.searchChallenges()
      })
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
</style>
