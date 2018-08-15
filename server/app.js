const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const graphqlHTTP = require('express-graphql');
const cookieSession = require('cookie-session');

const projectsHandlerFactory = require('./project_modules/projects_handler.js');
const userHandlerFactory = require('./project_modules/user_handler.js');
const githubLoginHandlerFactory = require('./project_modules/github_login.js');
const schema = require('./graphql/projects.js');

const secretSettings =
  JSON.parse(fs.readFileSync(`${__dirname}/secret_settings.json`, 'utf8'));

app = express();

app.use(express.static(path.join(__dirname, '/../frontend/dist')));

const mysqlConnectionPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env['MYSQL_HOSTNAME'],
  user: process.env['MYSQL_USER'],
  password: process.env['MYSQL_PASSWORD'],
  database: process.env['MYSQL_DATABASE']
});

const projectsHandler = projectsHandlerFactory({ mysqlConnectionPool });
const userHandler = userHandlerFactory({ mysqlConnectionPool });

//serve client application files
const pathToIndexHtml = path.join(__dirname, '/../frontend/dist/index.html')
const indexHtml = fs.readFileSync(pathToIndexHtml, 'utf8');
app.get(['/project/*', '/addproject'], function(req, res) {
  res.send(indexHtml)
})

app.use(cookieSession({
  secret: secretSettings['cookie_secret'],
  signed: true
}))

const graphqlHTTPInstance = graphqlHTTP((request, response, graphQLParams) => {
  return {
    schema,
    graphiql: true,
    context: {
      session: request.session,
      projectsHandler
    }
  }
})
app.use('/graphql', graphqlHTTPInstance)

const githubLoginHandler = githubLoginHandlerFactory({
  client_id: secretSettings['github'].client_id,
  client_secret: secretSettings['github'].client_secret,
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

async function checkAndStartServer(port) {
  try {
    let [rows] = await mysqlConnectionPool.query('select * from `Projects`')
    console.log(`query to db went fine. got ${rows.length} rows`);
  } catch(e) {
    console.error(`error reaching database: ${e.code}. terminating.`)
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`server started, listening on port ${port}`)
  })
}

checkAndStartServer(process.env['FUNDME_HTTP_PORT'] || 80)
