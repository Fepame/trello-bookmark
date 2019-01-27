import gql from 'graphql-tag'

export const GET_BOARDS = gql`
  query ($path: String!) {
    boards @rest(
      type: "Board", path: $path
    ) {
      __typename
      name
      id
      lists
      idOrganization
    }
  }
`

export const GET_TEAMS = gql`
  query ($path: String!) {
    teams @rest(
      type: "Team", path: $path
    ) {
      __typename
      displayName
      id
    }
  }
`

export const GET_CARD = gql`
  {
    card {
      position
      title
      link
      description
      listId
      __typename
    }
  }
`
