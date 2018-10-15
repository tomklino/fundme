const debug = require('nice_debug')("CHALLENGES_DEBUG")

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

const { ChallengeType } = require('./types.js')

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
