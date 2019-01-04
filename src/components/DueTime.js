import React from 'react'
import moment from "moment";
import { TimePicker } from 'antd'
import PropTypes from 'prop-types'

const timeFormat = 'HH:mm'

const DueTime = ({ dueTime, dueDate, onChangeDueTime }) => (
  <TimePicker 
    format={timeFormat}
    disabled={!dueDate}
    style={{width: '100%'}}
    value={dueTime ? moment(dueTime, timeFormat) : null}
    onChange={(momentObj, dateString) => onChangeDueTime(dateString)}
  />
)

DueTime.propTypes = {
  dueTime: PropTypes.string,
  dueDate: PropTypes.string,
  onChangeDueTime: PropTypes.func.isRequired
}

export default DueTime
