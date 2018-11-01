const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
} = require('graphql');

const WalletType = new GraphQLObjectType({
  name: 'WalletType',
  description: 'Wallet type definition',
  fields: () => ({
    value: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    currency_symbol: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'User type definition',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})

const ProjectType = new GraphQLObjectType({
  name: 'ProjectType',
  description: 'Project type definition',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    owner: {
      type: new GraphQLNonNull(UserType)
    },
    description: {
      type: GraphQLString
    },
    online_repo: {
      type: GraphQLString
    }
  })
});

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
      type: UserType
    },
    creator: {
      type: UserType
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
    pledged: {
      type: WalletType
    }
  })
})

module.exports = {
  UserType, ProjectType, ChallengeType, WalletType
}
