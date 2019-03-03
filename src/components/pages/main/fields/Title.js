import React, { useEffect } from 'react'
import { Input } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { getTabInfo } from '../../../../services/utils'
const { TextArea } = Input

const Title = ({ title, client }) => {
  useEffect(() => {
    getTabInfo(({title}) => client.writeData({ 
      data: {
        card: {
          title,
          __typename: "Card"
        }
      }
    }))
  })
  return (
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
  )
}

export default () => (
  <Query query={gql`{ card { title }}`}>
    {({ data: {card: { title }}, client }) => <Title
      title={title}
      client={client}      
    />}
  </Query>
)

