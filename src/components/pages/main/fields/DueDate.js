import React from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const dateFormat = "DD.MM.YYYY"

export default () => (
  <Query query={gql`{ card { dueDate }}`}>
    {({ data: {card: { dueDate }}, client }) => (
      <DatePicker 
        format={dateFormat}
        placeholder="Select date"
        style={{width: '100%'}}
        value={dueDate ? moment(dueDate, dateFormat) : null}
        onChange={(_, dateString) => client.writeData({
          data: {
            card: {
              dueDate: dateString,
              __typename: "Card"
            }
          }
        })}
      />
    )}
  </Query>
)

