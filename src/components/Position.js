import React from 'react'
import { Radio } from 'antd'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
const { Group, Button } = Radio

const GET_POSITION = gql`
  {
    card {
      position
    }
  }
`

const SET_POSITION = gql`
  mutation setPosition($position: String!) {
    setPosition (position: $position) @client
  }
`

const Position = () => (
  <Query query={GET_POSITION}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
      <Mutation mutation={SET_POSITION}>
        {setPosition => (
          <Group 
            value={card.position}
            buttonStyle="solid"
            onChange={e => {
              setPosition({
                variables: {
                  position: e.target.value,
                  __typename: "Card"
                }
              })
            }}
          >
            <Button value="top">Top</Button>
            <Button value="bottom">Bottom</Button>
          </Group>
        )}
      </Mutation>
    )}}
  </Query>
)

export default Position
