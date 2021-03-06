const express = require('express');
const mysql = require('mysql2/promise');
const graphqlHTTP = require('express-graphql');
const cookieSession = require('cookie-session');
const proxy = require('express-http-proxy');

const projectsHandlerFactory = require('./project_modules/projects_handler.js');
const challengeHandlerFactory = require('./project_modules/challenges_handler.js');
const userHandlerFactory = require('./project_modules/user_handler.js');
const githubLoginHandlerFactory = require('./project_modules/github_login.js');
const walletFactory = require('./project_modules/wallet.js');
const schema = require('./graphql/schema.js');

process.on('SIGTERM', tearDown)
process.on('SIGINT', tearDown)

function tearDown() {
  mysqlConnectionPool.end();
  process.exit(0)
}

const configLoader = require('./config-loader.js')

const config = configLoader({ home_dir: __dirname })

const mysqlConnectionPool = mysql.createPool(config.get('mysql'))
const listen_port = config.get('listen_port')

const wallet = walletFactory({ payment_gateway_url: config.get('payment_gateway_url') })
const userHandler = userHandlerFactory({
  mysqlConnectionPool, wallet, options: config.get('user_handler_options') });
const projectsHandler = projectsHandlerFactory({ mysqlConnectionPool });
const challengeHandler = challengeHandlerFactory({ mysqlConnectionPool, wallet });

app = express();

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

const proxy_to_frontend = config.get('FUNDME_DEV') ?
  proxy(`localhost:${listen_port}/`) :
  proxy(config.get('frontend_static_server'))

//serve client application files
const client_loading_spots = [ '/project/*', '/addproject' ]
if(config.get('FUNDME_DEV')) {
  const webpackConfig = require('./webpack.config.js')
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const compiler = webpack(webpackConfig);

  app.use(webpackMiddleware(compiler, {
    publicPath: '/'
  }))
  client_loading_spots.forEach((loading_spot) => {
    app.use(loading_spot, proxy_to_frontend)
  })
} else {
  console.log("PRODUCTION!")
  const proxy_to_frontend = proxy(config.get('frontend_static_server'))
  client_loading_spots.forEach((loading_spot) => {
    app.use(loading_spot, proxy_to_frontend)
  })
  app.use('/', proxy_to_frontend)
}

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

checkAndStartServer(listen_port)
