import gql from 'graphql-tag'

export const SET_CARD_FIELD = gql`
  mutation setCardField($fieldName: String!, $fieldValue: String!) {
    setCardField (fieldName: $fieldName, fieldValue: $fieldValue) @client
  }
`

export const SUBMIT_CARD = gql`
  mutation submitCard ($params: String!, $credentials: String!) {
    submitCard (input: {params: $params, credentials: $credentials}) @rest (
      method: "POST",
      path: "cards?{args.input.params}&{args.input.credentials}"
    ) {
      id
      __typeName
    }
  }
`