import React from 'react'
import { Cascader } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

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

function displayRender(label) {
  return label[label.length - 1];
}

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

          return <Cascader
            style={{width: '100%'}}
            options={options}
            expandTrigger="hover"
            changeOnSelect
          />
        }}
      </Query>
    }}
  </Query>
)

export default Location