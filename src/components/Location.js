import React from 'react'
import { Cascader } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_BOARDS, GET_TEAMS } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'
import { credentials } from '../services/utils'

const Location = () => (
  <Query query={GET_TEAMS} variables={{
    credentials
  }}>
    {({data: { teams }}) => {
      if(!teams) return null
      return <Query query={GET_BOARDS} variables={{
        credentials
      }}>
        {({ data: { boards }, client }) => {
          if(!boards) return null

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
                setCardField({
                  variables: {
                    fieldName: "listId",
                    fieldValue: listId,
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