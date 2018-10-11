<template>
  <v-btn
    v-on:click="logout()"
    flat>
    <v-icon>open_in_new</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: 'LogoutButton',
    methods: {
      logout() {
        this.$http.post('/logout')
          .then((data) => {
            console.log('logged out successfully')
            this.$root.$data.isUserLoggedIn = false;
            this.$root.$data.username = null;
            this.$root.$data.user_id = null;
          })
          .catch((e) => {
            console.log(`error logging out: ${e}`)
          })
      }
    }
  }
</script>
