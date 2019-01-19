import React, { Component } from 'react'
import { Select } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const { Option } = Select

const addToken = path => `${path}?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c`

const GetTeams = gql`
  query ($path: String!) {
    teams @rest(
      type: "Teams", path: $path
    ) {
      __typename
      displayName
      id
      selected @client
    }
  }
`

const Teams = () => (
  <Query query={GetTeams} variables={{ path: addToken('organizations') }}>
    {({ loading, error, data, client }) => {
      if (loading) return null
      if (error) return `Error!: ${error}`

      return <Select
        style={{width: 200}}
        onChange={id => {
          console.log(id)
          client.writeFragment({
            id: id,
            fragment: gql`
              fragment selectedTeam on Team {
                selected
              }
            `,
            data: {
              selected: true,
              __typename: "Team"
            }
          })
        }}
      >
        {data.teams.map(team => <Option
            key={team.id}
            value={team.id}
          >
            {team.displayName}
          </Option>
        )}
      </Select>
    }}
  </Query>
)

export default Teams