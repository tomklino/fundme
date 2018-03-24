const express = require('express');
const path = require('path');

app = express();

app.use(express.static(path.join(__dirname, '/../frontend/dist')));

app.listen(process.env['FUNDME_HTTP_PORT'] || 80)
