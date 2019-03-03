import React from 'react'
import moment from 'moment'
import { TimePicker } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const timeFormat = 'HH:mm'

export default () => (
  <Query query={gql`{ card { dueDate dueTime }}`}>
    {({ data: {card: { dueDate, dueTime }}, client }) => (
      <TimePicker 
        format={timeFormat}
        disabled={!dueDate}
        style={{width: '100%'}}
        value={dueTime ? moment(dueTime, timeFormat) : null}
        onChange={(_, dateString) => client.writeData({
          data: {
            card: {
              dueTime: dateString,
              __typename: "Card"
            }
          }
        })}
      />
    )}
  </Query>
)