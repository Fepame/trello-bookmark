import gql from 'graphql-tag'

export const SET_CARD_FIELD = gql`
  mutation setCardField($fieldName: String!, $fieldValue: String!) {
    setCardField (fieldName: $fieldName, fieldValue: $fieldValue) @client
  }
`