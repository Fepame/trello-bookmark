
import React from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
const { TextArea } = Input

const Title = ({ title, onTitleChange }) => (
  <TextArea 
    placeholder="Card title" 
    autosize={{ minRows: 2, maxRows: 2 }}
    value={title}
    onChange={e => onTitleChange(e.target.value)}
  />
)

Title.propTypes = {
  title: PropTypes.string,
  onTitleChange: PropTypes.func.isRequired
}

export default Title
