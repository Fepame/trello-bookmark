import React from 'react'
import { Avatar } from 'antd'
import PropTypes from 'prop-types'

const AssigneeList = ({ boardMembers, cardAssignee, onToggleCardAssignee }) => 
  !!boardMembers.length && boardMembers.map(member => {
    const sharedProps = {
      key: member.id,
      size: 64,
      alt: member.fullName,
      onClick: e => {
        onToggleCardAssignee(member.id)
      },
      style: {
        backgroundColor: '#1890ff',
        filter: cardAssignee
          .some(id => member.id === id)
          ? 'none'
          : 'grayscale(100%) contrast(50%) brightness(130%)'
        ,
        cursor: 'pointer'
      }
    }
    
    if(member.avatarUrl) {
      return <Avatar 
        src={`${member.avatarUrl}/170.png`} 
        {...sharedProps}
      />
    } else {
      return <Avatar
        {...sharedProps}
      >
        {member.initials}
      </Avatar>
    }
  })

AssigneeList.propTypes = {
  onToggleCardAssignee: PropTypes.func.isRequired,
  boardMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
  cardAssignee: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default AssigneeList
