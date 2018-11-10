const nconf = require('nconf');
const path = require('path');

module.exports = function configLoader({ home_dir = __dirname }) {
  nconf
    .argv()
    .env({
      separator: '__',
      lowerCase: true
    })

  nconf.file('config', {
    file: nconf.get('conf_file') || path.join(home_dir, 'config.json')
  })

  nconf.file('secrets', {
    file: nconf.get('secrets_file') || path.join(home_dir, 'secret_settings.json')
  })

  nconf.file('defaults', {
    file: path.join(home_dir, 'config.defaults.json')
  })

  return nconf;
}
