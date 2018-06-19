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
      id: { type: GraphQLString }
    },
    resolve: (root, args, context) => {
      const projects = [
        {
          id: 'imhere',
          name: "imhere"
        },
        {
          id: 'cheat_sheets',
          name: "Tom's cheat sheets",
          online_repo: "https://github.com/tomklino/cheat-sheets"
        },
        {
          id: 'frenchblog',
          name: "frenchblog",
          online_repo: "https://github.com/tomklino/frenchblog"
        },
        {
          id: 'friendly',
          name: "friendly",
          online_repo: "https://github.com/tomklino/friendly"
        }
      ]
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
