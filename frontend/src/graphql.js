import gql from 'graphql-tag'

export const CHALLENGE_MUTATION_CREATE = gql`
  mutation (
    $challenge_name: String!,
    $challenge_type: String!,
    $challenge_description: String,
    $project_id: String!) {
      addChallenge(
        challenge_name: $challenge_name,
        challenge_type: $challenge_type,
        challenge_description: $challenge_description,
        project_id: $project_id) {
          id
      }
    }
`

export const CHALLENGE_QUERY = gql`
  query ($project_id: String!) {
    challenges(project_id: $project_id) {
      id,
      challenge_type,
      challenge_description,
      name
    }
  }
`

export const PROJECT_MUTATION_CREATE = gql`
  mutation (
    $name: String!,
    $username: String!,
    $user_id: String!,
    $description: String) {
      addProject(
        name: $name,
        username: $username,
        user_id: $user_id,
        description: $description) {
          id
        }
    }
`

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
