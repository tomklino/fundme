<template>
  <div>
    <h1>Hi {{this.$root.$data.username}} Choose a project to add to voost</h1>
    <v-list two-line>
      <v-list-tile
        v-for="(project, index) in projects"
        :key="project.title"
        avatar
        @click="dialog = true; project_to_add = project.title"
      >
        <v-list-tile-content>
          <v-list-tile-title v-html="project.title"></v-list-tile-title>
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
              @click="dialog = false"
            >
              yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddProject',
  methods: {
    fetchRepositories: function() {

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
