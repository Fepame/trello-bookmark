import React from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'

const dateFormat = "DD.MM.YYYY"

const DueDate = ({ setCardField, card }) => (
  <DatePicker 
    format={dateFormat}
    placeholder="Select date"
    style={{width: '100%'}}
    value={card.dueDate ? moment(card.dueDate, dateFormat) : null}
    onChange={(momentObj, dateString) => setCardField({
      variables: {
        fieldName: "dueDate",
        fieldValue: dateString,
        __typename: "Card"
      }
    })}
  />
)

export default DueDate
