import React from 'react'
import { Input, Icon } from 'antd'
import { getTabInfo } from './../../../../services/utils'

const Link = ({ setCardField, card }) => {
  getTabInfo(tab => setCardField({
    variables: {
      fieldName: "link",
      fieldValue: tab.url,
      __typename: "Card"
    }
  }))
  
  return (
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
}

export default Link
