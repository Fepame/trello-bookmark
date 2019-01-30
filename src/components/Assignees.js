import React from 'react'
import { Avatar } from 'antd'
import { Query } from 'react-apollo'
import { GET_ASSIGNEES } from '../services/queries'
import { credentials } from '../services/utils'

const noBoardMessage = "Select board to set assignees"

const Assignees = ({ setCardField, card }) => {
  if(!card || !card.boardId) return noBoardMessage
  return <Query query={GET_ASSIGNEES} variables={{
    credentials,
    boardId: card.boardId
  }}>
    {({ data: { assignees }, client }) => {
      if(!assignees || !assignees.length) return noBoardMessage
      return assignees.map(member => {
        const sharedProps = {
          key: member.id,
          size: 64,
          alt: member.fullName,
          onClick: e => {
            {/* onToggleCardAssignee(member.id) */}
          },
          style: {
            margin: 1,
            backgroundColor: '#1890ff',
            filter: card.assignees
              .some(id => member.id === id)
              ? 'none'
              : 'grayscale(100%) contrast(50%) brightness(130%)'
            ,
            cursor: 'pointer'
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
}

export default Assignees
