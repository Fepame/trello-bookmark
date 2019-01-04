import React from 'react'
import moment from "moment";
import { DatePicker } from 'antd'
import PropTypes from 'prop-types'

const dateFormat = "DD.MM.YYYY"

const DueDate = ({ dueDate, onChangeDueDate }) => (
  <DatePicker 
    format={dateFormat}
    placeholder="Select date"
    style={{width: '100%'}}
    value={dueDate ? moment(dueDate, dateFormat) : null}
    onChange={(momentObj, dateString) => onChangeDueDate(dateString)}
  />
)

DueDate.propTypes = {
  dueDate: PropTypes.string,
  onChangeDueDate: PropTypes.func.isRequired
}

export default DueDate
