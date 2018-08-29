import gql from 'graphql-tag'

export const PROJECT_QUERY_BY_ID = gql`
  query ProjectsQuery($id: String) {
    projects (id: $id) {
      id,
      name,
      description,
      owner {
        username
      },
      online_repo
    }
  }
`

export const PROJECT_QUERY = gql`
  query ProjectsQuery($name: String) {
    projects (name: $name) {
      id,
      name,
      description,
      owner {
        username
      },
      online_repo
    }
  }
`
