import React from 'react'
import { Input } from 'antd'
const { TextArea } = Input

const Description = ({ setCardField, card })  => (
  <TextArea 
    placeholder="Card description" 
    autosize={{ minRows: 4, maxRows: 4 }}
    value={card.description}
    onChange={e => {
      setCardField({
        variables: {
          fieldName: "description",
          fieldValue: e.target.value,
          __typename: "Card"
        }
      })
    }}
  />
)

export default Description
