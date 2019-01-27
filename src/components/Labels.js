import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_CARD, GET_LABELS } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'

const Labels = ({children}) => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      if(!card.boardId) return <div>Loading...</div>
      return <Query query={GET_LABELS} variables={{ id: card.boardId}}>
        {({ data, client }) => {
          console.log(data)
          return <div>2</div>
        }}
      </Query>
    }}
  </Query>
)

export default Labels