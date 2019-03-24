import React from 'react'
import { Avatar } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { GET_MEMBERS } from '../../../../services/queries'

const noBoardMessage = "Select board to set assignees"

export default () => (
  <Query query={gql`{ card { boardId assignees }}`}>
    {({ data: {card: { boardId, assignees }} }) => {
      if(!boardId) return noBoardMessage
      return (
        <Query query={GET_MEMBERS} variables={{ boardId }} fetchPolicy="cache-and-network">
          {({ data: { members }, client }) => {
            if(!members || !members.length) return noBoardMessage
            return members.map(member => {
              const sharedProps = {
                key: member.id,
                size: 64,
                alt: member.fullName,
                onClick: () => client.writeData({
                  data: {
                    card: {
                      assignees: assignees.includes(member.id)
                        ? assignees.filter(assigneeId => member.id !== assigneeId)
                        : [...assignees, member.id],
                      __typename: "Card"
                    }
                  }
                }),
                style: {
                  margin: 1,
                  backgroundColor: '#1890ff',
                  cursor: 'pointer',
                  filter: assignees
                    .some(id => member.id === id)
                    ? 'none'
                    : 'grayscale(100%) contrast(50%) brightness(130%)'
                }
              }
              
              if(member.details.avatarUrl) {
                return <Avatar 
                  src={`${member.details.avatarUrl}/170.png`} 
                  {...sharedProps}
                />
              } else {
                return <Avatar
                  {...sharedProps}
                >
                  {member.details.initials}
                </Avatar>
              }
            })
          }}
        </Query>
      )}
    }
  </Query>
)
