import React from 'react'
import { Select, Tag, Input } from 'antd'
import { Query} from 'react-apollo'
import { GET_LABELS } from '../services/queries'
import { credentials, hexColor } from '../services/utils'

const { Option } = Select
const LabelsStub = <Input disabled placeholder="Select board to add labels" />

const Labels = ({ setCardField, card }) => {
  if(!card || !card.boardId) return LabelsStub
  return <Query query={GET_LABELS} variables={{
    credentials,
    boardId: card.boardId
  }}>
    {({ data: { labels }, client }) => {
      if(!labels) return LabelsStub
      return <Select
        mode="multiple"
        placeholder="Select labels"
        value={card.labels}
        onChange={labels => {
          setCardField({
            variables: {
              fieldName: "labels",
              fieldValue: labels,
              __typename: "Card"
            }
          })
        }}
        style={{width: '100%'}}
      >
        {labels.map(
          label => <Option key={label.id} value={label.id}>
            <Tag
              color={hexColor[label.color]}
              style={{
                width: '100%',
                textShadow: '1px 1px 1px rgba(50,50,50,0.7)',
                filter: card.labels.includes(label.id)
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
}

export default Labels