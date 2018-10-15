const debug = require('nice_debug')("PROJECTS_DEBUG")

const {
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull
} = require('graphql');

const { UserType, ProjectType } = require('./types.js')

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

module.exports = {
  projectQueries,
  projectMutations
}
