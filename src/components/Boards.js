import React from 'react'
import { Select } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const { Option } = Select

const addToken = path => `${path}?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`

const GET_BOARDS = gql`
  query getBoards ($path: String!) {
    boards @rest(
      type: "Board", path: $path
    ) {
      __typename
      name
      id
      closed
      url
      idOrganization
      selected @client
    }
  }
`

const GET_SELECTED_TEAM = gql`
  {
    teams {
      id
      selected @client
    }
  }
`

const Boards = () => (
  <div>
    <Query query={GET_SELECTED_TEAM} variables={{ selected: true }} >
      {({ data: { teams }, client: { cache } }) => {
        if (!teams) return null
        const isFoundSelected = teams.some(team => team.selected)
        const selectedTeamId = isFoundSelected ? teams.find(team => team.selected).id : null 

        return <Query query={GET_BOARDS} variables={{ path: addToken('boards')}}>
          {({ data, client: { cache } }) => {
            if (data && !Object.keys(data).length) return null

            return <Select
              style={{width: '100%'}}
            >
              {
                data
                .boards
                .filter(board => !board.closed)
                .filter(board => board.idOrganization === selectedTeamId)
                .map(board => {
                // console.log(board)
                  return (<Option
                      key={board.id}
                      value={board.id}
                    >
                      {board.name}
                    </Option>
                  )
                }
              )}
            </Select>
          }}
        </Query>
      }}
    </Query>
  </div>
)

export default Boards