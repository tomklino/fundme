<template>
  <div>
    <v-form v-model="valid">
      <v-text-field
        v-model="challenge_name"
        label="Challenge Name"
        required>
      </v-text-field>
      <v-select
        v-model="challenge_type"
        :items="challenge_types"
        label="Challenge Type"
        >
      </v-select>
      <v-textarea
        v-model="challenge_description"
        auto-grow
        box
        label="Description"
        rows="4"
      ></v-textarea>
      <v-btn @click="sumbitChallenge">SUBMIT</v-btn>
    </v-form>
  </div>
</template>

<script>
import { CHALLENGE_MUTATION_CREATE } from '@/graphql'

export default {
  name: 'AddChallenge',
  methods: {
    sumbitChallenge: function() {
      //TODO disable submit button and change to loading animation
      this.addChallenge({
        challenge_name: this.challenge_name,
        challenge_description: this.challenge_description,
        challenge_type: this.challenge_type,
        project_id: this.$route.params.project_id
      })
      //TODO after done, show dialog or redirect back to project
    },

    addChallenge: function (variables) {
        console.log("Adding challenge. variables: ");
        console.dir(variables)
        this.$apollo.mutate({
          mutation: CHALLENGE_MUTATION_CREATE,
          variables
        }).then((data) => {
          console.log("added challenge. here is the response:", data)
        }).catch((e) => {
          console.log("error while trying to create challenge:", e)
        })
      }
  },
  data () {
    return {
      valid: false,
      challenge_description: '',
      challenge_name: '',
      challenge_type: '',
      challenge_types: [
        "Bug", "Feature"
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
