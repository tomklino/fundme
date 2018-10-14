const debug = require('nice_debug')("CHALLENGES_DEBUG")

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} = require('graphql');

const ChallengeType = new GraphQLObjectType({
  name: 'ChallengeType',
  description: 'Challenge type defintion',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    assignee: {
      type: GraphQLString
    },
    creator: {
      type: GraphQLString
    },
    project_id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    challenge_description: {
      type: GraphQLString
    },
    challenge_type: {
      type: new GraphQLNonNull(GraphQLString)
    },
    amout_pledged: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    currency_symbol: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})

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
      return await challengeHandler.queryChallenges({
        project_id: args.project_id
      })
    }
  }
}

const challengeMutations = {
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
