const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const graphqlHTTP = require('express-graphql');

const schema = require('./graphql/projects.js');

const mysqlPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env['MYSQL_HOSTNAME'],
  user: process.env['MYSQL_USER'],
  password: process.env['MYSQL_PASSWORD'],
  database: process.env['MYSQL_DATABASE']
})

mysqlPool.query('select * from `Projects`')
  .then(([rows, fields]) => {
    console.log('query went fine...')
})

app = express();

const pathToIndexHtml = path.join(__dirname, '/../frontend/dist/index.html')
app.use(express.static(path.join(__dirname, '/../frontend/dist')));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
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

app.listen(process.env['FUNDME_HTTP_PORT'] || 80)
