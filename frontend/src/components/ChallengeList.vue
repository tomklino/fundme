<template>
  <v-list>
    <v-list-tile
      v-for="challenge in challenges"
      :key="challenge.title"
      avatar
      @click=""
    >
      <v-list-tile-action>
        <v-icon v-if="challenge.challenge_type === 'Feature'" color="pink">star</v-icon>
        <v-icon v-if="challenge.challenge_type === 'Bug'" color="pink">bug_report</v-icon>
      </v-list-tile-action>

      <v-list-tile-content>
        <v-list-tile-title v-text="challenge.name"></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import { CHALLENGE_QUERY } from '@/graphql'

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
