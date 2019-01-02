import React from 'react'
import { Tag } from 'antd'
import convertCssColorNameToHex from 'convert-css-color-name-to-hex'
import PropTypes from 'prop-types'

const TagList = ({ labels, selectedLabels, onLabelChange }) => 
  !!labels.length && labels.map(
    label =>
      <Tag
        color={convertCssColorNameToHex(label.color)}
        key={label.id}
        onClick={e => onLabelChange(label.id)}
        style={{
          filter: selectedLabels.includes(label.id)
            ? 'none'
            : 'grayscale(30%) opacity(90%)'
        }}
      >{label.name || String.fromCharCode(160) }</Tag>)

TagList.propTypes = {
  onLabelChange: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default TagList
