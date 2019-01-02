import React from 'react'
import { Input, Icon } from 'antd'
import PropTypes from 'prop-types'

const Link = ({ link, onLinkChange }) => (
  <Input 
    placeholder="Link" 
    addonAfter={<Icon type="link" />}
    value={link}
    onChange={e => onLinkChange(e.target.value)}
  />
)

Link.propTypes = {
  onLinkChange: PropTypes.func.isRequired
}

export default Link
