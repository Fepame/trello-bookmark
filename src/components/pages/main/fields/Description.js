import React from 'react'
import { Input } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const { TextArea } = Input

export default ()  => (
  <Query query={gql`
    {
      card {
        description
      }
    }
  `}>
    {({ data: {card: { description }}, client }) => (
      <TextArea 
        placeholder="Card description" 
        autosize={{ minRows: 4, maxRows: 4 }}
        value={description}
        onChange={e => {
          client.writeData({
            data: {
              card: {
                description: e.target.value,
                __typename: "Card"
              }
            }
          })
        }}
      />
    )}
  </Query>
)
