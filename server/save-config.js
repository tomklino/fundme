const nconf = require('nconf');
const fs = require('fs')
nconf
  .argv()

let conf_file_location =
  nconf.get('conf-file-location') || __dirname + '/config.json'
nconf.file(conf_file_location)

nconf.file('defaults', __dirname + '/config.defaults.json')

const key = nconf.get('key')
const val = nconf.get('val')

nconf.set(key, val)

nconf.save(function (err) {
  if(nconf.get('verbose')) {
    fs.readFile(conf_file_location, function (err, data) {
      console.dir(JSON.parse(data.toString()))
    });
  }
});
