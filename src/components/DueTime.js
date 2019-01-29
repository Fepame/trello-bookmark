import React from 'react'
import moment from 'moment'
import { TimePicker } from 'antd'

const timeFormat = 'HH:mm'

const DueTime = ({ setCardField, card }) => (
  <TimePicker 
    format={timeFormat}
    disabled={!card.dueDate}
    style={{width: '100%'}}
    value={card.dueTime ? moment(card.dueTime, timeFormat) : null}
    onChange={(momentObj, dateString) => setCardField({
      variables: {
        fieldName: "dueTime",
        fieldValue: dateString,
        __typename: "Card"
      }
    })}
  />
)

export default DueTime