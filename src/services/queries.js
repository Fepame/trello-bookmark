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

export const GET_MEMBERS = gql`
  query ($boardId: String!) {
    members (boardId: $boardId) @rest(
      type: "Member",
      path: "boards/{args.boardId}/members"
    ) {
      id @export(as: "id")
      fullName
      username
      details @rest(
        type: "MemberDetails",
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
    boardLabels (boardId: $boardId) @rest(
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
      spinner {
        type
        isVisible
        __typename
      }
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
      teamId
      dueTime
      cover
      assignees
      __typename
    }
  }
`
