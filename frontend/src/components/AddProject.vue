<template>
  <div>
    <h1>Link a project to Voost</h1>
    <v-list two-line>
      <v-list-tile
        v-for="(project, index) in projects"
        :key="project.name"
        avatar
        @click="dialog = true; project_to_add = project.name"
      >
        <v-list-tile-content>
          <v-list-tile-title v-html="project.name"></v-list-tile-title>
          <v-list-tile-sub-title v-html="project.description"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">Add {{project_to_add}} to voost?</v-card-title>
          <v-card-text>This will add a project listing for &quot;{{project_to_add}}&quot; and you and others will be able to add feature requests and pledge for them, or sponsor your project
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="grey darken-1"
              flat="flat"
              @click="dialog = false"
            >
              No
            </v-btn>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog = false; addProject(project_to_add)"
            >
              yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'AddProject',
  mounted() {
    if(!this.$root.$data.username) {
      console.error("no user is signed in. page cannot render without a username");
      //TODO redirect back to home
      return null;
    }
    this.fetchRepositories(this.$root.$data.username);
  },
  methods: {
    addProject: function(name) {
      let username = this.$root.$data.username;
      let user_id = this.$root.$data.user_id;
      console.log("Adding project", name)
      this.$apollo.mutate({
        mutation: gql`mutation ($name: String!, $username: String!, $user_id: String!) {
          addProject(name: $name, username: $username, user_id: $user_id) {
            id
          }
        }`,
        variables: {
          name, username, user_id
        }
      }).then((data) => {
        console.log("added project, here is the data", data)
        this.$router.push({ name: 'home' })
      })
    },
    fetchRepositories: function(github_username) {
      fetch(`https://api.github.com/users/${github_username}/repos`)
        .then(res => res.json())
        .then(data => this.projects = data)
    }
  },
  data () {
    return {
      dialog: false,
      project_to_add: null,
      projects: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
