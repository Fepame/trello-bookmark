import React from 'react'
import { Input, Icon } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_CARD } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'

const Link = () => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
      <Mutation mutation={SET_CARD_FIELD}>
        {setCardField => (
          <Input 
            placeholder="Link" 
            addonAfter={<Icon type="link" />}
            value={card.link}
            onChange={e => {
              setCardField({
                variables: {
                  fieldName: "link",
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

export default Link
