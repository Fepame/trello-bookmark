import gql from 'graphql-tag'

export const GET_BOARDS = gql`
  query {
    boards @rest(
      type: "Board",
      path: "members/me/boards?filter=open&lists=open"
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
  query {
    teams @rest(
      type: "Team", 
      path: "members/me/organizations"
    ) {
      __typename
      displayName
      id
    }
  }
`

export const GET_ASSIGNEES = gql`
  query ($boardId: String!) {
    assignees (boardId: $boardId) @rest(
      type: "Assignee",
      path: "boards/{args.boardId}/members"
    ) {
      id @export(as: "id")
      fullName
      username
      details @rest(
        type: "AssigneeDetails",
        path: "member/{exportVariables.id}"
      ) {
        initials
        avatarUrl    
      }
    }
  }
`

export const GET_LABELS = gql`
  query ($boardId: String!) {
    labels (boardId: $boardId) @rest(
      type: "Label",
      path: "boards/{args.boardId}/labels"
    ) {
      id
      name
      color
    }
  }
`

export const GET_SETTINGS = gql`
  {
    settings {
      isLoading
      __typename
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
      assignees
      __typename
    }
  }
`
