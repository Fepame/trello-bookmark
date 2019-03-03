import React, { useEffect } from 'react'
import { Input, Icon } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { getTabInfo } from '../../../../services/utils'

const Link = ({ link, client }) => {
  useEffect(() => {
    getTabInfo(({url}) => client.writeData({ 
      data: {
        card: {
          link: url,
          __typename: "Card"
        }
      }
    }))
  })
  return (
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
  )
}

export default () => (
  <Query query={gql`{ card { link }}`}>
    {({ data: {card: { link }}, client }) => <Link
      link={link}
      client={client}      
    />}
  </Query>
)
