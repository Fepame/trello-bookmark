import React from 'react'
import { Input, Icon } from 'antd'

const Link = ({ setCardField, card }) => (
  <Input 
    placeholder="Link" 
    addonAfter={<Icon type="link" />}
    value={card.link}
    onChange={e => {
      setCardField({
        variables: {
          fieldName: "link",
          fieldValue: e.target.value,
          __typename: "Card"
        }
      })
    }}
  />
)

export default Link
