import gql from 'graphql-tag'

export const GET_BOARDS = gql`
  query ($credentials: String!) {
    boards (credentials: $credentials) @rest(
      type: "Board",
      path: "members/me/boards?filter=open&lists=open&{args.credentials}"
    ) {
      __typename
      name
      id @export(as: "boardId")
      lists
      idOrganization
      labels (credentials: $credentials) @rest(
        type: "Label",
        path: "boards/{exportVariables.boardId}/labels?{args.credentials}"
      ) {
        id
        name
        color
      }
    }
  }
`

export const GET_TEAMS = gql`
  query ($credentials: String!) {
    teams (credentials: $credentials) @rest(
      type: "Team", 
      path: "members/me/organizations?{args.credentials}"
    ) {
      __typename
      displayName
      id
    }
  }
`

export const GET_LABELS = gql`
  {
    boards {
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
      boardId
      listId
      __typename
    }
  }
`
