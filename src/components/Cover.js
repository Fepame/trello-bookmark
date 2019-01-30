import React from 'react'
import { Icon } from 'antd'
import { getImageSrc } from '../services/utils'

const Cover = ({ setCardField, card }) => {
  document.onpaste = e => getImageSrc(
    e, 
    cover => setCardField({
      variables: {
        fieldName: "cover",
        fieldValue: cover,
        __typename: "Card"
      }
    })
  )

  return (
    <figure
      className="ant-input"
      style={{
        lineHeight: '10px',
        padding: 4,
        height: 150,
        textAlign: card.cover ? 'right' : 'center',
        color: '#bfbfbf',
        transition: 'none',
        background: card.cover ? `#fff url(${card.cover}) 50% 50% / contain no-repeat` : 'none'
      }}
    >
      {
        card.cover ? <Icon
          type="close"
            style={{
              fontSize: 10,
              cursor: 'pointer',
              color: '#333'
            }}
            onClick={() => setCardField({
              variables: {
                fieldName: "cover",
                fieldValue: '',
                __typename: "Card"
              }
            })}
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
}

export default Cover
