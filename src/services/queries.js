import gql from 'graphql-tag'

export const GET_POSITION = gql`
  {
    card {
      position
    }
  }
`
export const GET_TITLE = gql`
  {
    card {
      title
    }
  }
`