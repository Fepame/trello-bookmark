import React from 'react'
import { Input, Icon } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

// getTabInfo(tab => setCardField({
//   variables: {
//     fieldName: "link",
//     fieldValue: tab.url,
//     __typename: "Card"
//   }
// }))

export default () => (
  <Query query={gql`{ card { link }}`}>
    {({ data: {card: { link }}, client }) => (
      <Input 
        placeholder="Link" 
        addonAfter={<Icon type="link" />}
        value={link}
        onChange={e => client.writeData({
          data: {
            card: {
              link: e.target.value,
              __typename: "Card"
            }
          }
        })}
      />
    )}
  </Query>
)
