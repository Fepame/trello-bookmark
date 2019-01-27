import React from 'react'
import { Input } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_CARD } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'
const { TextArea } = Input

const Title = () => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
      <Mutation mutation={SET_CARD_FIELD}>
        {setCardField => (
          <TextArea 
            placeholder="Card title" 
            autosize={{ minRows: 2, maxRows: 2 }}
            value={card.title}
            onChange={e => {
              setCardField({
                variables: {
                  fieldName: "title",
                  fieldValue: e.target.value,
                  __typename: "Card"
                }
              })
            }}
          />
        )}
      </Mutation>
    )}}
  </Query>
)

export default Title
