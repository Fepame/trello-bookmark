import React from 'react'
import { Tag, Select } from 'antd'
import { hexColor } from "../services/utils";
import PropTypes from 'prop-types'
const { Option } = Select

const LabelList = ({ labels, selectedLabels, onLabelChange }) => 
  <Select
    mode="multiple"
    placeholder="Please select labels"
    onChange={onLabelChange}
  >
    {labels.map(
      label => <Option key={label.id} value={label.id}>
        <Tag
          color={hexColor[label.color]}
          style={{
            width: '100%',
            textShadow: '1px 1px 1px rgba(50,50,50,0.7)',
            filter: selectedLabels.includes(label.id)
              ? 'none'
              : 'grayscale(30%) opacity(90%)'
          }}
        >
          {label.name || String.fromCharCode(160) }
        </Tag>
      </Option>)}
  </Select>

LabelList.propTypes = {
  onLabelChange: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default LabelList
