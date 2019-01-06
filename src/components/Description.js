
import React from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
const { TextArea } = Input

const Description = ({ description, onDescriptionChange }) => (
  <TextArea 
    placeholder="Card description" 
    autosize={{ minRows: 4, maxRows: 4 }}
    value={description}
    onChange={e => onDescriptionChange(e.target.value)}
  />
)

Description.propTypes = {
  description: PropTypes.string,
  onDescriptionChange: PropTypes.func.isRequired
}

export default Description
