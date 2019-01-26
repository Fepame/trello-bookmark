import React from 'react'
import { Select } from 'antd'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
const { Option } = Select

const addToken = path => `${path}?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`

const GET_TEAMS = gql`
  query ($path: String!) {
    teams @rest(
      type: "Team", path: $path
    ) {
      __typename
      displayName
      id
    }
  }
`

const addTokenFithFilter = path => `${path}?filter=open&lists=open&token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`

const GET_BOARDS = gql`
  query ($path: String!) {
    boards @rest(
      type: "Board", path: $path
    ) {
      __typename
      name
      id
      lists
      idOrganization
    }
  }
`

const Teams = () => (
  <Query query={GET_TEAMS} variables={{ path: addToken('organizations') }}>
    {({ data: { teams }, client }) => {
      if(!teams) return null
      return <Query query={GET_BOARDS} variables={{ path: addTokenFithFilter('boards') }}>
        {({ data: { boards }, client }) => {
          if(!boards) return null
          console.log(boards)
          const options = teams.map(team => ({
            value: team.id,
            label: team.displayName,
            children: boards
              .filter(board => board.idOrganization === team.id)
              .map(board => ({
                value: board.id,
                label: board.name,
                children: board.lists.map(list => ({
                  value: list.id,
                  label: list.name
                }))
              }))
          }))
          console.log(options)
          return null
        }}
      </Query>
    }}
  </Query>
)

export default Teams