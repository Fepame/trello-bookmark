import gql from 'graphql-tag'

export const SET_CARD_FIELD = gql`
  mutation setCardField($fieldName: String!, $fieldValue: String!) {
    setCardField (fieldName: $fieldName, fieldValue: $fieldValue) @client
  }
`

export const SUBMIT_CARD = gql`
  mutation submitCard ($params: String!) {
    submitCard (input: {params: $params}) @rest (
      method: "POST",
      path: "cards?{args.input.params}"
    ) {
      id
      __typeName
    }
  }
`

export const SUBMIT_CARD_ATTACHMENT = gql`
  mutation submitCardAttachment (
    $data: any, 
    $cardId: String!
  ){
    submitCardAttachment (
      input: $data,
      cardId: $cardId
    ) @rest (
      method: "POST",
      bodySerializer: "form",
      path: "cards/{args.cardId}/attachments"
    )
  }
`