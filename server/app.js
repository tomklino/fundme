const express = require('express');
const path = require('path');
const fs = require('fs');

projects = [
  {
    id: 'imhere',
    name: "imhere"
  },
  {
    id: 'cheat_sheets',
    name: "Tom's cheat sheets",
    online_repo: "https://github.com/tomklino/cheat-sheets"
  },
  {
    id: 'frenchblog',
    name: "frenchblog",
    online_repo: "https://github.com/tomklino/frenchblog"
  },
  {
    id: 'friendly',
    name: "friendly",
    online_repo: "https://github.com/tomklino/friendly"
  }
]

function isProjectExists(project_id) {
  return projects.some((project) => project.id === project_id)
}

function getProjectAboutText(project_id) {
  return `Hello, I am the about text for ${project_id}`
}

app = express();
const pathToIndexHtml = path.join(__dirname, '/../frontend/dist/index.html')

app.get('/api/projects_list', function(req, res) {
  res.send(projects);
})

app.get('/api/project/:project_id/:properties', function(req, res) {
  let project_id = req.params.project_id;
  let properties = req.params.properties.split(',');

  if (!isProjectExists(project_id)) {
    res.status(404)
      .send('not found')
    return;
  }

  let response = {};
  if(properties.includes('about')) {
    projectAboutText = getProjectAboutText(project_id);
    if (projectAboutText === undefined) {
      res.status(404)
        .send('not found')
      return;
    }

    response.about = projectAboutText;
  }

  res.send(JSON.stringify(response))
})

app.use(express.static(path.join(__dirname, '/../frontend/dist')));

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
