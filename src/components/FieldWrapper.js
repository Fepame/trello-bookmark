import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_CARD } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'

const FieldWrapper = (props) => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
      <Mutation mutation={SET_CARD_FIELD}>
        {setCardField => props.children({setCardField, card})}
      </Mutation>
    )}}
  </Query>
)

export default FieldWrapper