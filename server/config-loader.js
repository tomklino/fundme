const nconf = require('nconf');

module.exports = function configLoader({ home_dir = __dirname }) {
  nconf
    .argv()
    .env('__')

  nconf.file('config', {
    file: nconf.get('CONF_FILE') || home_dir + '/config.json'
  })

  nconf.file('secrets', {
    file: nconf.get('SECRETS_FILE') || home_dir + '/secret_settings.json'
  })

  nconf.file('defaults', {
    file: home_dir + '/config.defaults.json'
  })

  return nconf;
}
