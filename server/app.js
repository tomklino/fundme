const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const graphqlHTTP = require('express-graphql');
const request = require('superagent');
const projectsHandlerFactory = require('./project_modules/projects_handler.js');
const cookieSession = require('cookie-session');

const schema = require('./graphql/projects.js');

const mysqlConnectionPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env['MYSQL_HOSTNAME'],
  user: process.env['MYSQL_USER'],
  password: process.env['MYSQL_PASSWORD'],
  database: process.env['MYSQL_DATABASE']
})

const projectsHandler = projectsHandlerFactory({mysqlConnectionPool})

app = express();

const pathToIndexHtml = path.join(__dirname, '/../frontend/dist/index.html')
app.use(express.static(path.join(__dirname, '/../frontend/dist')));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: {projectsHandler}
}))

app.get('/project/*', function(req, res) {
  console.log("registering request for " + req.url)
  fs.readFile(pathToIndexHtml, 'utf8', (err, html) => {
    if(err) {
      console.error(err.code);
      res.status(500)
        .send('whoops, some error')
      return;
    }
    res.send(html)
  })
})

const cookieSecret =
  JSON.parse(fs.readFileSync(`${__dirname}/secret_settings.json`, 'utf8'))['cookie_secret']
app.use(cookieSession({
  secret: cookieSecret,
  signed: true
}))

//TODO write this as a middleware
const { githubClientID, githubClientSecret } =
  JSON.parse(fs.readFileSync(`${__dirname}/secret_settings.json`, 'utf8'))['github']

app.get('/login/github_callback', async function(req, res) {
  const { query } = req;
  const { code } = query;

  if(!code) {
    return res.send({
      success: false,
      message: 'Error: no code'
    })
  }

  console.log('code', code);

  try {
    const githubResponse =
    await request.post('https://github.com/login/oauth/access_token')
    .send({
      client_id: githubClientID,
      client_secret: githubClientSecret,
      code
    })
    .set('Accept', 'application/json')

    const accessToken = githubResponse.body['access_token']
    console.log(`accessToken is ${accessToken}`)
    const githubUserResponse =
    await request.get('https://api.github.com/user')
      .set('Authorization', `token ${accessToken}`)
      .set('Accept', 'application/json')

    req.session.github_userid = githubUserResponse.body.id;
    res.send(githubUserResponse);
  } catch(e) {
    res.send(JSON.stringify(e))
  }
})

app.get('/user/whoami', function(req, res) {
  return res.send(`your githib userid is ${req.session.github_userid}`)
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
