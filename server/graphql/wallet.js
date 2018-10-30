const debug = require('nice_debug')("WALLET_GRAPHQL_DEBUG")

// const {
//
// } = require('graphql');

const { WalletType } = require('./types.js')

const walletQueries = {
  wallet_total: {
    type: WalletType,
    args: {},
    resolve: async (root, args, context) => {
      const { session, wallet, userHandler } = context;
      if(!session.user_id) {
        debug(1, "not logged in");
        return { value: 0, currency_symbol: "USD" }
      }

      const { user_id } = session;
      debug(1, "user_id", user_id)
      const user_data =
        await userHandler.findUserById({ user_id })
      debug(1, "user_data", user_data)
      let { account_token } = user_data;
      debug(1, "account_token:", account_token, !!account_token)

      //TODO creation of account should be done seperately and if not account token found should answer with an error
      if(!account_token) {
        debug(1, "user does not have an account. creating...")
        account_token = await wallet.createAccount({
          account_name: `user account ${user_id}`
        });
        debug(1, "created account. account_token:", account_token)
        await userHandler.updateUserAccount({ user_id, account_token })
      }

      let wallet_total = await wallet.getWalletTotal({ account_token })
      debug(1, "wallet_total:", wallet_total)
      return wallet_total;
    }
  }
}

module.exports = {
  walletQueries
}
