import React from 'react'
import { Cascader, Select } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_BOARDS, GET_TEAMS } from '../../../../services/queries'
import { SET_CARD_FIELD } from '../../../../services/mutations'
import { credentials } from '../../../../services/utils'

const LocationStub = <Select
  placeholder="Select card location"
  style={{ width: '100%' }}
/>

const Location = () => (
  <Query query={GET_TEAMS} variables={{
    credentials
  }}>
    {({data: { teams }}) => {
      if(!teams) return LocationStub
      return <Query query={GET_BOARDS} variables={{
        credentials
      }}>
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
              style={{width: '100%'}}
              options={options}
              fieldNames={{ label: 'name', value: 'id' }}
              expandTrigger="hover"
              placeholder="Select card location"
              popupClassName="cascader-popup"
              allowClear={false}
              onChange={path => {
                const [listId] = path.slice(-1)
                const [boardId] = path.slice(-2)
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
              autoFocus
            />}
          </Mutation>
        }}
      </Query>
    }}
  </Query>
)

export default Location