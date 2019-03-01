import React from 'react'
import { Input } from 'antd'
import { getTabInfo } from './../../../../services/utils'
const { TextArea } = Input

const Title = ({ setCardField, card })  => {
  getTabInfo(tab => setCardField({
    variables: {
      fieldName: "title",
      fieldValue: tab.title,
      __typename: "Card"
    }
  }))

  return (
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
}

export default Title
