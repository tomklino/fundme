<template>
    <v-btn
      flat v-bind:href=github_login_link>
      <!-- FIXME: image not showing up on firefox -->
      <img src="@/assets/github-logo.svg" style="max-width: 50%; max-height: 50%;">
      <span v-if="show_login_button">Login with GitHub</span>
      <v-progress-circular v-if="!show_login_button && github_username === null" indeterminate />
      <span v-if="!show_login_button && github_username !== null">{{github_username}}</span>
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
    ],
    methods: {
      checkLogin: function() {
        fetch('/whoami', {credentials: 'same-origin'})
          .then(res => res.json())
          .then(({logged_in, github_userid, github_username}) => {
            if(logged_in) {
              this.show_login_button = false;
              this.github_login_link = null;
              this.github_userid = github_userid;
              this.github_username = github_username;
              this.$emit('user-signed-in', github_username);
            } else {
              this.show_login_button = true;
            }
          })
      }
    },
    data () {
      return {
        github_login_link: `https://github.com/login/oauth/authorize?client_id=${this.github_clientid}`,
        show_login_button: false,
        github_userid: null,
        github_username: null
      }
    }
  }
</script>
