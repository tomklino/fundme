const {
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');

const ProjectType = new GraphQLObjectType({
  name: 'ProjectType',
  description: 'Project type definition',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    online_repo: {
      type: GraphQLString
    }
  })
});

const projectMutations = {
  createProject: {
    type: ProjectType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      online_repo: {
        type: GraphQLString
      }
    },
    resolve: async (rootValue, {name, online_repo}, context) => {
      var id = await context.projectsHandler.createNewProject({name, online_repo})
      return await context.projectsHandler.queryProjectsById({id});
    }
  }
}

const projectQueries = {
  projects: {
    type: new GraphQLList(ProjectType),
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString }
    },
    resolve: async (root, args, context) => {
      if (args.id) {
        return await context.projectsHandler.queryProjectsById({id: args.id})
      } else if(args.name) {
        return await context.projectsHandler.queryProjectsByName({name: args.name})
      }
      return args.id ?
          projects.filter(project => project.id === args.id) :
          projects;
    }
  }
}

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...projectQueries
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...projectMutations
    })
  })
})
