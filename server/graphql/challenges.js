const debug = require('nice_debug')("CHALLENGES_DEBUG")

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
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
    project_id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    project_type: {
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

}

const challengeMutations = {
  addChallenge: {
    type: new GraphQLList(GraphQLString),
    args: {
      challenge_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      challenge_type: {
        type: new GraphQLNonNull(GraphQLString)
      },
      project_id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (root, args, context) => {
      let { challengeHandler } = context;
      try {
        let challenge_id = await challengeHandler.createNewChallenge({
          challenge_name: args.challenge_name,
          challenge_type: args.challenge_type,
          project_id: args.project_id
        })
        return [ challenge_id ];
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
