import React from 'react'
import { Cascader } from 'antd'
import { Query, Mutation } from 'react-apollo'
import { GET_BOARDS, GET_TEAMS } from '../services/queries'
import { SET_CARD_FIELD } from '../services/mutations'

const addToken = path => `${path}?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`
const addTokenFithFilter = path => `${path}?filter=open&lists=open&token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`

const Location = () => (
  <Query query={GET_TEAMS} variables={{ path: addToken('organizations') }}>
    {({ data: { teams }, client }) => {
      if(!teams) return null
      return <Query query={GET_BOARDS} variables={{ path: addTokenFithFilter('boards') }}>
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