import React, { Component } from 'react'
import { Select } from 'antd'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
const { Option } = Select

const addToken = path => `${path}?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`

const GET_TEAMS = gql`
  query ($path: String!) {
    teams @rest(
      type: "Teams", path: $path
    ) {
      __typename
      displayName
      id
    }
  }
`

const SET_SELECTED_TEAM = gql`
  mutation setSelectedTeam($selectedTeamId: String!) {
    setSelectedTeam(selectedTeamId: $selectedTeamId) @client
  }
`

const Teams = () => (
  <Query query={GET_TEAMS} variables={{ path: addToken('organizations') }}>
    {({ loading, error, data, client }) => {
      if (loading) return null
      if (error) return `Error!: ${error}`

      return <Mutation mutation={SET_SELECTED_TEAM}>
        {setSelectedTeam => <Select
          style={{width: 200}}
          onChange={id => {
            setSelectedTeam({variables: { selectedTeamId: id }})
          }}
        >
          {data.teams.map(team => <Option
              key={team.id}
              value={team.id}
            >
              {team.displayName}
            </Option>
          )}
        </Select>}
      </Mutation>
    }}
  </Query>
)

export default Teams