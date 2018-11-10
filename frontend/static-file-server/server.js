const express = require('express');
const path = require('path');
const fs = require('fs');

function tearDown() {
  process.exit(0);
}

process.on('SIGTERM', tearDown)
process.on('SIGINT', tearDown)

const app = express();

const frontend_production_dir = path.join(__dirname, 'dist');
app.use(express.static(frontend_production_dir));

const index_html_file =
  fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');

app.get('/', (req, res) => {
  res.send(index_html_file);
})

const port = process.env['LISTEN_PORT'] || 3000;
app.listen(port, () => {
  console.log(`server started, listening on port ${port}`);
})
