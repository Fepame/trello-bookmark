import React from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'
const { Group, Button } = Radio

const Position = ({ position, onPositionChange }) => (
  <Group 
    value={position}
    buttonStyle="solid"
    onChange={e => onPositionChange(e.target.value)}
  >
    <Button value="top">Top</Button>
    <Button value="bottom">Bottom</Button>
  </Group>
)

Position.propTypes = {
  position: PropTypes.string.isRequired,
  onPositionChange: PropTypes.func.isRequired
}

export default Position
