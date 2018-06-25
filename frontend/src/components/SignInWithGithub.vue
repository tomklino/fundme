<template>
  <div>
    <a
      v-if="show_login_button"
      href="https://github.com/login/oauth/authorize?client_id=5c6f1bd40f1841f1674a"
    >Sign In With Github
    </a>
    <span v-if="!show_login_button && github_userid === null">Loading...</span>
    <span v-if="!show_login_button && github_userid !== null">{{github_userid}}</span>
  </div>
</template>

<script>
  export default {
    name: 'SignInWithGithub',
    mounted () {
      this.checkLogin()
    },
    methods: {
      checkLogin: function() {
        fetch('/whoami', {credentials: 'same-origin'})
          .then(res => res.json())
          .then(({logged_in, github_userid}) => {
            if(logged_in) {
              this.show_login_button = false;
              this.github_userid = github_userid;
            } else {
              this.show_login_button = true;
            }
          })
      }
    },
    data () {
      return {
        show_login_button: false,
        github_userid: null
      }
    }
  }
</script>
