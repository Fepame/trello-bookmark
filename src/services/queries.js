import gql from 'graphql-tag'

export const GET_BOARDS = gql`
  query ($credentials: String!) {
    boards (credentials: $credentials) @rest(
      type: "Board",
      path: "boards?filter=open&lists=open&{args.credentials}"
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
  query ($credentials: String!) {
    teams (credentials: $credentials) @rest(
      type: "Team", 
      path: "organizations?{args.credentials}"
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
