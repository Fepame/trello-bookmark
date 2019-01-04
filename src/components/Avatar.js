import React from 'react'
import { Avatar } from 'antd'
import { getAvatarURL } from "../services/utils"
import PropTypes from 'prop-types'

const AvatarList = ({ boardMembers, cardAssignee, onToggleCardAssignee }) => 
  !!boardMembers.length && boardMembers.map(member => 
    <Avatar 
      src={getAvatarURL(member.avatarHash)} 
      key={member.id} 
      size={64}
      onClick={e => {
        onToggleCardAssignee(member.id)
      }}
      style={{
        filter: cardAssignee
          .some(id => member.id === id)
          ? 'none'
          : 'grayscale(100%) contrast(50%) brightness(130%)'
        ,
        cursor: 'pointer'}}
    />)

AvatarList.propTypes = {
  onToggleCardAssignee: PropTypes.func.isRequired,
  boardMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
  cardAssignee: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default AvatarList
