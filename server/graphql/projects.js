const debug = require('nice_debug')("PROJECTS_DEBUG")

const {
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');

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
      //TODO: this should be GraphQLString?
      type: new GraphQLNonNull(GraphQLID)
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

const projectMutations = {
  addProject: {
    type: new GraphQLList(ProjectType),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      username: {
        type: new GraphQLNonNull(GraphQLString)
      },
      user_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      description: {
        type: GraphQLString
      }
    },
    resolve: async (rootValue, args, context) => {
      let { session, projectsHandler } = context;
      debug(2, require('util').inspect(context, { depth: null }));
      debug(1, "addProject mutations starting...", args)
      if(session.github_username !== args.username) {
        console.error("username mismatch while trying to add project")
        return
      }
      let id = await projectsHandler.createNewProject(args)
      return await projectsHandler.queryProjectsById({id})
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
      let { projectsHandler } = context;
      if (args.id) {
        return await projectsHandler.queryProjectsById({id: args.id})
      } else if(args.name) {
        return await projectsHandler.queryProjectsByName({name: args.name})
      } else {
        //search with no args
        return await projectsHandler.queryProjects()
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
