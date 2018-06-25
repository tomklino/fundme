const request = require('superagent');
const debug = require('nice_debug')("GITHUB_LOGIN_DEBUG");

module.exports = githubLoginHandlerFactory;

function githubLoginHandlerFactory({client_id, client_secret, mysqlConnectionPool}) {
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

      debug(1, `setting session.github_userid to ${githubUserResponse.body.id}`)
      req.session.github_userid = githubUserResponse.body.id;
      res.redirect('/');
    } catch(e) {
      //TODO redirect to error page
      res.send(JSON.stringify(e))
    }
  }
}