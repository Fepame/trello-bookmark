import React from 'react'
import { Cascader, Select } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_BOARDS, GET_TEAMS } from '../../../../services/queries'
import { SET_CARD_FIELD, SET_SETTING } from '../../../../services/mutations'

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

const Location = ({ pathDefaults }) => (
  <Mutation mutation={SET_SETTING}>
    {setSetting => (
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

              return <Mutation mutation={SET_CARD_FIELD}>
                {setCardField => <Cascader
                  autoFocus
                  options={options}
                  style={{width: '100%'}}
                  fieldNames={{ label: 'name', value: 'id' }}
                  expandTrigger="hover"
                  placeholder="Select card location"
                  popupClassName="cascader-popup"
                  value={pathDefaults.lastUsed}
                  allowClear={false}
                  showSearch={{ filter }}
                  onChange={path => {
                    const [listId] = path.slice(-1)
                    const [boardId] = path.slice(-2)
                    setSetting({
                      variables: {
                        fieldName: "pathDefaults",
                        fieldValue: {
                          lastUsed: path,
                          __typename: "PathDefaults"
                        }
                      },
                      __typename: "Settings"
                    })
                    setCardField({
                      variables: {
                        fieldName: "listId",
                        fieldValue: listId,
                        __typename: "Card"
                      }
                    })
                    setCardField({
                      variables: {
                        fieldName: "boardId",
                        fieldValue: boardId,
                        __typename: "Card"
                      }
                    })
                    setCardField({
                      variables: {
                        fieldName: "labels",
                        fieldValue: [],
                        __typename: "Card"
                      }
                    })
                  }}
                />}
              </Mutation>
            }}
          </Query>
        }}
      </Query>
    )}
  </Mutation>
)

export default Location