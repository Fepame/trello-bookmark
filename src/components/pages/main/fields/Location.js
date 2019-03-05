import React from 'react'
import { Cascader, Select } from 'antd'
import { Query } from 'react-apollo'
import { GET_BOARDS, GET_TEAMS } from '../../../../services/queries'
import gql from 'graphql-tag'

const LocationStub = <Select
  placeholder="Select card location"
  style={{ width: '100%' }}
/>

const filter = (inputValue, path) => path
  .some(option => 
    option
    .name
    .toLowerCase()
    .indexOf(
      inputValue.toLowerCase()
    ) > -1
  )

export default () => (
  <Query query={GET_TEAMS}>
    {({data: { teams }}) => {
      if(!teams) return LocationStub
      return <Query query={GET_BOARDS}>
        {({ data: { boards }, client }) => {
          if(!boards) return LocationStub

          const options = [{
            id: null,
            displayName: "Private"
          }, ...teams].map(team => ({
            ...team,
            name: team.displayName,
            children: boards
              .filter(board => board.idOrganization === team.id)
              .map(board => ({
                ...board,
                children: board.lists
              }))
          }))

          return (
            <Query query={gql`{ card { teamId boardId listId }}`}>
              {({ data: { card }, client }) => (
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
              )}
            </Query>
          )
        }}
      </Query>
    }}
  </Query>
)
