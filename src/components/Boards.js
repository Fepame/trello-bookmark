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

const Boards = () => (
  <Query query={GET_BOARDS} variables={{ path: addToken('boards') }}>
    {({ loading, error, data, client: { cache } }) => {
      if (loading) return null
      if (error) return `Error!: ${error}`

      return <Select
        style={{width: '100%'}}
      >
        {data.boards.map(board => {
          /* console.log(board) */
          return (<Option
              key={board.id}
              value={board.id}
            >
              {board.name}
            </Option>
          )}
        )}
      </Select>
    }}
  </Query>
)

export default Boards