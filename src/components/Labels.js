import React from 'react'
import { Select, Tag } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_CARD, GET_LABELS } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'
import { credentials, hexColor } from '../services/utils'

const { Option } = Select


const Labels = ({children}) => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card || !card.boardId) return null
      return <Query query={GET_LABELS} variables={{
        credentials,
        boardId: card.boardId
      }}>
        {({ data: { labels }, client }) => {
          if(!labels) return null
          return  <Mutation mutation={SET_CARD_FIELD}>
            {setCardField => <Select
              mode="multiple"
              placeholder="Select labels"
              value={card.selectedLabels}
              onChange={selectedLabels => {
                setCardField({
                  variables: {
                    fieldName: "selectedLabels",
                    fieldValue: selectedLabels,
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
                    filter: card.selectedLabels.includes(label.id)
                      ? 'none'
                      : 'grayscale(30%) opacity(90%)'
                  }}
                >
                  {label.name || String.fromCharCode(160) }
                </Tag>
              </Option>)}
          </Select>}
        </Mutation>}}
      </Query>
    }}
  </Query>
)

export default Labels