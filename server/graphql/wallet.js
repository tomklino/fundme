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
      const user_data =
        await userHandler.findUserById({ user_id })
      let { account_token } = user_data;

      //// FIXME: handle this as an error
      if(!account_token) {
        debug(1, "user does not have an account. returning");
        return null;
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
