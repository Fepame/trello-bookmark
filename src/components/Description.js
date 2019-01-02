
import React from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
const { TextArea } = Input

const Description = ({ description, onDescriptionChange }) => (
  <TextArea 
    placeholder="Card description" 
    autosize={{ minRows: 2 }}
    value={description}
    onChange={e => onDescriptionChange(e.target.value)}
  />
)

Description.propTypes = {
  onDescriptionChange: PropTypes.func.isRequired
}

export default Description
