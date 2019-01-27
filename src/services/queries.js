import gql from 'graphql-tag'

export const GET_CARD = gql`
  {
    card {
      position
      title
      link
      description
      __typename
    }
  }
`
