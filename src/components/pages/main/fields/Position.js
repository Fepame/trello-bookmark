import React from 'react'
import { Radio } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const { Group, Button } = Radio

export default () => (
  <Query query={gql`{ card { position }}`}>
    {({ data: {card: { position }}, client }) => (
      <Group 
        value={position}
        buttonStyle="solid"
        onChange={e => client.writeData({
          data: {
            card: {
              position: e.target.value,
              __typename: "Card"
            }
          }
        })}
      >
        <Button value="top">Top</Button>
        <Button value="bottom">Bottom</Button>
      </Group>
    )}
  </Query>
)
