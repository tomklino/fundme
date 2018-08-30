const {
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql')

const { challengeQueries, challengeMutations } = require('./challenges.js')
const { projectQueries, projectMutations } = require('./projects.js')

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...challengeQueries,
      ...projectQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...challengeMutations,
      ...projectMutations
    })
  })
})
