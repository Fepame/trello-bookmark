import React from 'react'
import { Cascader } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

// const LocationStub = <Select
//   placeholder="Select card location"
//   style={{ width: '100%' }}
// />

const filter = (inputValue, path) => path
  .some(option => 
    option
    .name
    .toLowerCase()
    .indexOf(
      inputValue.toLowerCase()
    ) > -1
  )

const Location = ({card, options, client}) => <Cascader
  autoFocus
  value={[card.teamId, card.boardId, card.listId]}
  options={options}
  style={{width: '100%'}}
  fieldNames={{ label: 'name', value: 'id' }}
  expandTrigger="hover"
  placeholder="Select card location"
  popupClassName="cascader-popup"
  allowClear={false}
  showSearch={{ filter }}
  onChange={path => {
    const [ teamId, boardId, listId ] = path

    client.writeData({
      data: {
        card: boardId === card.boardId
          ? {
            listId,
            __typename: "Card"
          } : {
            listId,
            boardId,
            teamId,
            labels: [],
            assignees: [],
            __typename: "Card"
          }
      }
    })
  }}
/>

export default ({ locationTree }) => (
  <Query query={gql`{ card { teamId boardId listId }}`}>
    {({ data: { card }, client }) => {

      const validateLastLocation = card => {
        const { teamId, boardId, listId } = card
        const isTeamValid = locationTree
          .some(team => team.id === teamId)

        if(!isTeamValid) return false

        const isBoardValid = locationTree
          .find(team => team.id === teamId)
          .children
          .some(board => board.id === boardId)

        if(!isBoardValid) return false

        const isListValid = locationTree
          .find(team => team.id === teamId)
          .children
          .find(board => board.id === boardId)
          .children
          .some(list => list.id === listId)

        if(!isListValid) return false
        return true
      }

      if(validateLastLocation(card)) {
        return <Location
          card={card}
          options={locationTree}
          client={client}
        />
      } else {
        const newCardData = {
          teamId: null,
          boardId: '',
          listId: ''
        }
        client.writeData({
          data: {
            card: {
              ...newCardData,
              __typename: "Card"
            }
          }
        })
        localStorage.removeItem("lastLocation")
        return <Location
          card={newCardData}
          options={locationTree}
          client={client}
        />
      }  
    }}
  </Query>
)
