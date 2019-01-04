import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'

const Cover = ({ imageSrc, onRemoveCover }) => (
  <figure
    className="ant-input"
    style={{
      lineHeight: '10px',
      padding: 4,
      height: 150,
      textAlign: imageSrc ? 'right' : 'center',
      color: '#bfbfbf',
      transition: 'none',
      background: imageSrc ? `#fff url(${imageSrc}) 50% 50% / contain no-repeat` : 'none'
    }}
  >
    {
      imageSrc ? <Icon
            type="close"
            style={{
              fontSize: 10,
              cursor: 'pointer',
              color: '#333'
            }}
            onClick={onRemoveCover}
          />
          : <span>
          <Icon
            type="eye"
            style={{
              clear: 'both',
              display: 'block',
              color: '#ddd',
              marginTop: 30,
              height: 70,
              fontSize: 50
            }}
          />
          Paste image from clipboard
      </span>
    }
  </figure>
)

Cover.propTypes = {
  imageSrc: PropTypes.string,
  onRemoveCover: PropTypes.func.isRequired
}

export default Cover
