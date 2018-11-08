<template>
    <v-btn
      flat v-bind:href=github_login_link v-bind:disabled="!show_login_button">
      <!-- FIXME: image not showing up on firefox -->
      <img src="@/assets/github-logo.svg" style="max-width: 50%; max-height: 50%;">
      <span v-if="show_login_button">Login with GitHub</span>
      <v-progress-circular v-if="!show_login_button && logged_in_user === null" indeterminate />
      <span v-if="!show_login_button && logged_in_user !== null">{{logged_in_user}}</span>
    </v-btn>
</template>

<script>
  export default {
    name: 'SignInWithGithub',
    mounted () {

      this.checkLogin();
    },
    props: [
      'github_clientid',
      'github_redirect_uri',
      'logged_in_user'
    ],
    methods: {
      checkLogin: function() {
        fetch('/whoami', {credentials: 'same-origin'})
          .then(res => res.json())
          .then(({ logged_in, github_userid, github_username, user_id }) => {
            if(logged_in) {
              this.$emit('user-signed-in', {
                github_userid,
                github_username,
                user_id
              });
            }
          })
      }
    },
    computed: {
      show_login_button: function() {
        return !this.logged_in_user
      },
      github_login_link: function() {
        return this.logged_in_user ?
          null :
          'https://github.com/login/oauth/authorize' +
          '?client_id=' + this.github_clientid +
          (this.github_redirect_uri ? '&redirect_uri=' + this.github_redirect_uri : '')
      }
    }
  }
</script>
