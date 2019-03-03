import React from 'react'
import { Input } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const { TextArea } = Input

// getTabInfo(tab => setCardField({
//   variables: {
//     fieldName: "title",
//     fieldValue: tab.title,
//     __typename: "Card"
//   }
// }))
export default () => (
  <Query query={gql`{ card { title }}`}>
    {({ data: {card: { title }}, client }) => (
      <TextArea 
        placeholder="Card title" 
        autosize={{ minRows: 2, maxRows: 2 }}
        value={title}
        onChange={e => client.writeData({
          data: {
            card: {
              title: e.target.value,
              __typename: "Card"
            }
          }
        })}
      />
    )}
  </Query>
)

