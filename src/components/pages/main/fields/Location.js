import React from 'react'
import { Cascader } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { validateLastLocation } from '../../../../services/utils'
// import { saveLocations } from '../../../../services/ls'

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


const Location = ({card, options, client}) => (
  <Cascader
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
)

export default ({ locationTree }) => (
  <Query query={gql`{ card { teamId boardId listId link }}`}>
    {({ data: { card }, client }) => {

      if(validateLastLocation(card, locationTree)) {
        return <Location
          card={card}
          options={locationTree}
          client={client}
        />
      } else {
        const newCardData = {
          teamId: null,
          link: card.link,
          boardId: '',
          listId: ''
        }
        {/* let locations = client.readQuery({ query: gql`
          { locations { site id pathStr }}
        `})

        locations[0] = [
          {id: 0, site: 'lastLocation', pathStr: '', __typename: "Location"}
        ]

        saveLocations(locations) */}

        client.writeData({
          data: {
            card: {
              ...newCardData,
              __typename: "Card"
            },
            
          }
        })
        {/* setLocation("lastLocation", "") */}
        return <Location
          card={newCardData}
          options={locationTree}
          client={client}
        />
      }  
    }}
  </Query>
)
