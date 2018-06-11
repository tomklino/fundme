const express = require('express');
const path = require('path');

app = express();

projects = [
  {name: "imhere"},
  {name: "Tom's cheat sheets", online_repo: "https://github.com/tomklino/cheat-sheets"},
  {name: "frenchblog", online_repo: "https://github.com/tomklino/frenchblog"},
  {name: "friendly", online_repo: "https://github.com/tomklino/friendly"}
]

app.get('/api/projects_list', function(req, res) {
  res.send(projects);
})

app.use(express.static(path.join(__dirname, '/../frontend/dist')));

app.listen(process.env['FUNDME_HTTP_PORT'] || 80)
