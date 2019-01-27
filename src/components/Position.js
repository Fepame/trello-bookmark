import React from 'react'
import { Radio } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_CARD } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'
const { Group, Button } = Radio

const Position = () => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
      <Mutation mutation={SET_CARD_FIELD}>
        {setCardField => (
          <Group 
            value={card.position}
            buttonStyle="solid"
            onChange={e => {
              setCardField({
                variables: {
                  fieldName: "position",
                  fieldValue: e.target.value,
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
