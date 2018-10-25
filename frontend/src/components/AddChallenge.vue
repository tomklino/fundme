<template>
    <v-card class="addChallenge">
      <v-form ref="form" v-model="valid">
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
          <v-btn @click="sumbitChallenge" :disabled="sumbit_button_disabled" color="success">
            <v-progress-circular v-if="sumbit_button_disabled" />
            {{ sumbit_button_text }}
          </v-btn>
      </v-form>
    </v-card>
</template>

<script>
import {
  CHALLENGE_MUTATION_CREATE,
  CHALLENGE_QUERY
} from '@/graphql'

export default {
  name: 'AddChallenge',
  methods: {
    sumbitChallenge: async function() {
      this.sumbit_button_disabled = true;
      this.sumbit_button_text = "";
      await this.addChallenge({
        challenge_name: this.challenge_name,
        challenge_description: this.challenge_description,
        challenge_type: this.challenge_type,
        project_id: this.$route.params.project_id,
        creator: this.$root.$data.user_id
      })
      this.$emit('submitted');
      this.$refs.form.reset();
      this.sumbit_button_text = "Submit";
      this.sumbit_button_disabled = false;
    },

    addChallenge: async function (variables) {
        console.log("Adding challenge. variables: ");
        console.dir(variables)
        return await this.$apollo.mutate({
          mutation: CHALLENGE_MUTATION_CREATE,
          variables,
          awaitRefetchQueries: true,
          refetchQueries: [{
            query: CHALLENGE_QUERY,
            variables: {
              project_id: this.$route.params.project_id
            }
          }]
        })
      }
  },
  data () {
    return {
      sumbit_button_disabled: false,
      sumbit_button_text: "SUBMIT",
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
.addChallenge {
  width: 600px;
  padding: 20px;
}

.instructions{
  margin: 4px auto 16px;
  font-size: 17px;
}

</style>
