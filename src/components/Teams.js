import React from 'react'
import { Select } from 'antd'
import { Query } from 'react-apollo'
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
      selected @client
    }
  }
`

const Teams = () => (
  <Query query={GET_TEAMS} variables={{ path: addToken('organizations') }}>
    {({ loading, error, data, client: { cache } }) => {
      if (loading) return null
      if (error) return `Error!: ${error}`

      return <Select
        style={{width: '100%'}}
        onChange={id => {
          const query = gql`
            {
              teams {
                selected @client
                id
                displayName
                __typename
              }
            }
          `
          const data = cache.readQuery({ query })
          cache.writeQuery({
            query,
            data: {
              teams: data.teams.map(team => ({
                ...team,
                selected: team.id === id
              }))
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