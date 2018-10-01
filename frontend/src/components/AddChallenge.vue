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
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'AddChallenge',
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
