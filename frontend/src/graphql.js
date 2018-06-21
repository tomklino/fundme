import gql from 'graphql-tag'

export const PROJECT_QUERY = gql`
  query ProjectsQuery($name: String!) {
    projects(name: $name) {
      id
      name
      online_repo
    }
  }
`
