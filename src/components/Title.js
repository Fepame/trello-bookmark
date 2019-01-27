import React from 'react'
import { Input } from 'antd'
const { TextArea } = Input

const Title = ({ setCardField, card })  => (
  <TextArea 
    placeholder="Card title" 
    autosize={{ minRows: 2, maxRows: 2 }}
    value={card.title}
    onChange={e => {
      setCardField({
        variables: {
          fieldName: "title",
          fieldValue: e.target.value,
          __typename: "Card"
        }
      })
    }}
  />
)
export default Title
