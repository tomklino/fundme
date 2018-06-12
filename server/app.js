const express = require('express');
const path = require('path');

app = express();

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

app.listen(process.env['FUNDME_HTTP_PORT'] || 80)
