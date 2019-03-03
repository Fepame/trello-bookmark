import React from 'react'
import { Icon } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { getImageSrc } from '../../../../services/utils'

// const updateCover = (cover, cb) => cb(cover)
// document.onpaste = e => getImageSrc(
//   e, 
//   cover => setCardField({
//     variables: {
//       fieldName: "cover",
//       fieldValue: cover,
//       __typename: "Card"
//     }
//   })
// )

export default () => (
  <Query query={gql`{ card { cover }}`}>
    {({ data: {card: { cover }}, client }) => (
      <figure
        className="ant-input"
        style={{
          lineHeight: '10px',
          padding: 4,
          height: 150,
          textAlign: cover ? 'right' : 'center',
          color: '#bfbfbf',
          transition: 'none',
          background: cover ? `#fff url(${cover}) 50% 50% / contain no-repeat` : 'none'
        }}
      >
        {
          cover ? <Icon
            type="close"
              style={{
                fontSize: 10,
                cursor: 'pointer',
                color: '#333'
              }}
              onClick={() => client.writeData({
                data: {
                  card: {
                    cover: '',
                    __typename: "Card"
                  }
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
    )}
  </Query>
)

