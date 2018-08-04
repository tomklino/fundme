const {
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');

//TODO add nice debug

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
  addProject: {
    type: new GraphQLList(ProjectType),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      username: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (rootValue, {name, username}, context) => {
      //TODO replace with debug(1)
      console.log(require('util').inspect(context, { depth: null }));
      console.log("addProject mutations starting...", name, username)
      if(context.session.github_username !== username) {
        console.error("username mismatch while trying to add project")
        return
      }
      var id = await context.projectsHandler.createNewProject({name, username})
      return await context.projectsHandler.queryProjectsById({id})
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
      return []
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
