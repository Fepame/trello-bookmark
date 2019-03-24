import React from 'react'
import { Select, Tag, Input } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { GET_LABELS } from '../../../../services/queries'
import { hexColor } from '../../../../services/utils'

const { Option } = Select
const noBoardMessage = <Input disabled placeholder="Select board to add labels" />

export default () => (
  <Query query={gql`{ card { boardId labels }}`}>
    {({ data: { card: { boardId, labels } }}) => {
      if(!boardId) return noBoardMessage
      return <Query query={GET_LABELS} variables={{ boardId }} fetchPolicy="cache-and-network">
        {({ data: { boardLabels }, client }) => {
          if(!boardLabels) return noBoardMessage
          return <Select
            mode="multiple"
            placeholder="Select labels"
            value={labels}
            onChange={boardLabels => client.writeData({
              data: {
                card: {
                  labels: boardLabels,
                  __typename: "Card"
                }
              }
            })}
            style={{width: '100%'}}
          >
            {boardLabels.map(
              label => <Option key={label.id} value={label.id}>
                <Tag
                  color={hexColor[label.color]}
                  style={{
                    width: '100%',
                    textShadow: '1px 1px 1px rgba(50,50,50,0.7)',
                    filter: labels.includes(label.id)
                      ? 'none'
                      : 'grayscale(30%) opacity(90%)'
                  }}
                >
                  {label.name || String.fromCharCode(160) }
                </Tag>
              </Option>
            )}
          </Select>
        }}
      </Query>
    }}
  </Query>
)
