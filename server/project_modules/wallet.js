const debug = require('nice_debug')("WALLET_DEBUG")
const request = require('superagent');

function walletFactory({ payment_gateway_url }) {
  debug(1, "initiazligin wallet with payment_gateway_url:", payment_gateway_url)
  return {
    getWalletTotal(args) {
      return _getWalletTotal(payment_gateway_url, args)
    },
    createAccount(args) {
      return _createAccount(payment_gateway_url, args)
    },
    addCoupon(args) {
      return _addCoupon(payment_gateway_url, args)
    }
  }
}

module.exports = walletFactory;

async function _addCoupon(payment_gateway_url, args) {
  const { account_token, value, currency_symbol = "USD" } = args;

  try {
    var response =
      await request
      .post(`${payment_gateway_url}/add_coupon`)
      .send({
        destination_account: account_token,
        value,
        currency_symbol
      })
  } catch(err) {
    debug(1, err.code)
    throw err;
  }

  return account_token;
}

async function _createAccount(payment_gateway_url, args) {
  const { account_name } = args;
  debug(1, "creating account. account name:", account_name)

  try {
    var response =
      await request
      .post(`${payment_gateway_url}/create`)
      .send({ account_name })
  } catch(err) {
    debug(1, err.code)
    throw err;
  }

  const { account_token } = JSON.parse(response.text);
  debug(1, "account created. account_token:", account_token)
  return account_token;
}

async function _getWalletTotal(payment_gateway_url, args) {
  const { account_token } = args;

  const response =
    await request.get(`${payment_gateway_url}/account_total/${account_token}`)

  const account_total = JSON.parse(response.text)
  return account_total;
}
