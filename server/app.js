const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const graphqlHTTP = require('express-graphql');
const cookieSession = require('cookie-session');

const projectsHandlerFactory = require('./project_modules/projects_handler.js');
const challengeHandlerFactory = require('./project_modules/challenges_handler.js');
const userHandlerFactory = require('./project_modules/user_handler.js');
const githubLoginHandlerFactory = require('./project_modules/github_login.js');
const walletFactory = require('./project_modules/wallet.js');
const schema = require('./graphql/schema.js');

const webpackConfig = require('./webpack.config.js')
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const compiler = webpack(webpackConfig);

const configLoader = require('./config-loader.js')

const config = configLoader({ home_dir: __dirname })

const mysqlConnectionPool = mysql.createPool(config.get('mysql'))

const wallet = walletFactory({ payment_gateway_url: config.get('payment_gateway_url') })
const userHandler = userHandlerFactory({
  mysqlConnectionPool, wallet, options: config.get('user_handler_options') });
const projectsHandler = projectsHandlerFactory({ mysqlConnectionPool });
const challengeHandler = challengeHandlerFactory({ mysqlConnectionPool });

app = express();

//serve client application files
const client_loading_spots = [ '/project/*', '/addproject' ]
if(config.get('FUNDME_DEV')) {
  app.use(webpackMiddleware(compiler, {
    publicPath: '/'
  }))
  const proxy = require('express-http-proxy');
  client_loading_spots.forEach((loading_spot) => {
    app.use(loading_spot, proxy("localhost:3000/"))
  })
} else {
  console.log("PRODUCTION!")
  app.use(express.static(path.join(__dirname, '/../frontend/dist')));
}

app.use(cookieSession({
  secret: config.get('cookie_secret'),
  signed: true
}))

const graphqlHTTPInstance = graphqlHTTP((request, response, graphQLParams) => {
  return {
    schema,
    graphiql: true,
    context: {
      session: request.session,
      projectsHandler,
      challengeHandler,
      userHandler,
      wallet
    }
  }
})
app.use('/graphql', graphqlHTTPInstance)

const githubLoginHandler = githubLoginHandlerFactory({
  client_id: config.get('github').client_id,
  client_secret: config.get('github').client_secret,
  userHandler
})
app.use('/login/github_callback', githubLoginHandler)

app.get('/whoami', function(req, res) {
  return res.send({
    logged_in: req.session.github_userid !== undefined,
    github_userid: req.session.github_userid || '',
    github_username: req.session.github_username || '',
    user_id: req.session.user_id
  })
})

app.post('/logout', function(req, res) {
  req.session = null;
  return res.send("logged off successfully");
})

async function checkAndStartServer(port) {
  try {
    let [ rows ] = await mysqlConnectionPool.query('select * from `Projects`')
    console.log(`query to db went fine. got ${rows.length} rows`);
  } catch(e) {
    console.error(`error reaching database: ${e.code}. terminating.`)
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`server started, listening on port ${port}`)
  })
}

checkAndStartServer(config.get('listen-port'))
