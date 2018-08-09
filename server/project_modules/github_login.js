const request = require('superagent');
const debug = require('nice_debug')("GITHUB_LOGIN_DEBUG");

module.exports = githubLoginHandlerFactory;

function githubLoginHandlerFactory({ client_id, client_secret, userHandler }) {
  return async function githubLoginHandler(req, res, next) {
    const { code } = req.query;

    if(!code) {
      return res.status(401).send({
        success: false,
        message: 'Error: no code'
      })
    }

    debug(1, 'code:', code)

    try {
      const githubResponse =
        await request.post('https://github.com/login/oauth/access_token')
          .send({ client_id, client_secret, code })
          .set('Accept', 'application/json')

      const { access_token } = githubResponse.body
      debug(1, `accessToken is ${access_token}`)
      const githubUserResponse =
        await request.get('https://api.github.com/user')
          .set('Authorization', `token ${access_token}`)
          .set('Accept', 'application/json')

      let user_id = await userHandler.createUser({
        github_id: githubUserResponse.body.id,
        github_login: githubUserResponse.body.login,
        github_access_token: access_token
      }).catch((e) => {
        if( e.code === "ERROR_USER_EXIST" ) {
          //TODO in this case, update the access token
          debug(1, "user that logged in already exists, skipping creation")
        } else {
          throw e;
        }
      })
      debug(2, require('util').inspect(user_id, { depth: null }))
      if(!user_id) {
        debug(1, "user_id not defined by creation, looking up existing one")
        user_id = await userHandler.findUserByGithubId({
          github_id: githubUserResponse.body.id
        })
        debug(2, require('util').inspect(user_id, { depth: null }))
      }
      debug(1, `setting session.github_userid to ${githubUserResponse.body.id}`)
      req.session.github_userid = githubUserResponse.body.id;
      req.session.github_username = githubUserResponse.body.login;
      req.session.user_id = user_id;
      res.redirect('/');
    } catch(e) {
      //TODO redirect to error page
      debug(1, require('util').inspect(e, { depth: null }))
      res.send(JSON.stringify(e))
    }
  }
}
