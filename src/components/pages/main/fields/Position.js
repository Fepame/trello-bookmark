import React from 'react'
import { Radio } from 'antd'
const { Group, Button } = Radio

const Position = ({ setCardField, card }) => (
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
)

export default Position
