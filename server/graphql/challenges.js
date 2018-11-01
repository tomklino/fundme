const debug = require('nice_debug')("CHALLENGES_DEBUG")

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

const { ChallengeType, WalletType } = require('./types.js')

const challengeQueries = {
  challenges: {
    type: new GraphQLList(ChallengeType),
    args: {
      project_id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      const { challengeHandler } = context;

      let challenges_list = await challengeHandler.queryChallenges({
        project_id: args.project_id
      })
      debug(1, "challenge query resolves to:", challenges_list)
      return challenges_list;
    }
  }
}

const challengeMutations = {
  pledgeToChallenge: {
    type: WalletType,
    args: {
      challenge_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      amount: {
        type: new GraphQLNonNull(GraphQLFloat)
      },
      currency_symbol: {
        type: GraphQLString
      }
    },
    resolve: async(root, args, context) => {
      let { userHandler, challengeHandler, wallet, session } = context;
      let { challenge_id, amount, currency_symbol = "USD" } = args;
      debug(1, "pledging to challenge called with args:", args)
      if(!session.user_id) {
        debug(1, "not logged in")
        return null;
      }

      let challenge_account_token =
        await challengeHandler.getOrCreateChallengeAccount({ challenge_id })
      let { account_token: user_account_token } =
        await userHandler.findUserById({ user_id: session.user_id })

      try {
        await wallet.transfer({
          source_account: user_account_token,
          destination_account: challenge_account_token,
          amount,
          amount_currency: currency_symbol
        })
      } catch(err) {
        debug(1, "error while transfering:", err.code)
        // TODO: return a valuable error message so the reason could be displayed to the user
        return null;
      }

      return await wallet.getWalletTotal({
        account_token: challenge_account_token
      })
    }
  },

  assignUserToChallenge: {
    type: new GraphQLList(ChallengeType),
    args: {
      challenge_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      user_id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      let { challengeHandler } = context;
      try {
        let challenge_id = await challengeHandler.assignUserToChallenge(args)
        return await challengeHandler.queryChallenge({ challenge_id });
      } catch(e) {
        console.error("ERROR: challenges.js: " + e.code)
        throw e;
      }
    }
  },

  addChallenge: {
    type: new GraphQLList(ChallengeType),
    args: {
      challenge_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      challenge_type: {
        type: new GraphQLNonNull(GraphQLString)
      },
      challenge_description: {
        type: GraphQLString
      },
      project_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      creator: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      let { challengeHandler } = context;
      try {
        let challenge_id = await challengeHandler.createNewChallenge(args);
        return await challengeHandler.queryChallenge({ challenge_id });
      } catch(e) {
        console.error("ERROR: challenges.js: " + e.code)
        throw e;
      }
    }
  }
}

module.exports = {
  challengeQueries,
  challengeMutations
}
