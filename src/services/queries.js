import gql from 'graphql-tag'

export const GET_BOARDS = gql`
  query ($credentials: String!) {
    boards (credentials: $credentials) @rest(
      type: "Board",
      path: "members/me/boards?filter=open&lists=open&{args.credentials}"
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
      path: "members/me/organizations?{args.credentials}"
    ) {
      __typename
      displayName
      id
    }
  }
`

export const GET_LABELS = gql`
  query ($credentials: String!, $boardId: String!) {
    labels (credentials: $credentials, boardId: $boardId) @rest(
      type: "Label",
      path: "boards/{args.boardId}/labels?{args.credentials}"
    ) {
      id
      name
      color
    }
  }
`

export const GET_CARD = gql`
  {
    card {
      position
      title
      labels
      link
      description
      boardId
      listId
      dueDate
      dueTime
      cover
      __typename
    }
  }
`
