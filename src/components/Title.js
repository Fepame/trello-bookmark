import React from 'react'
import { Input } from 'antd'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
const { TextArea } = Input

const GET_TITLE = gql`
  {
    card {
      title
    }
  }
`

const SET_TITLE = gql`
  mutation setTitle($title: String!) {
    setTitle (title: $title) @client
  }
`

const Title = () => (
  <Query query={GET_TITLE}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
      <Mutation mutation={SET_TITLE}>
        {setTitle => (
          <TextArea 
            placeholder="Card title" 
            autosize={{ minRows: 2, maxRows: 2 }}
            value={card.title}
            onChange={e => {
              setTitle({
                variables: {
                  title: e.target.value,
                  __typename: "Card"
                }
              })
            }}
          />
        )}
      </Mutation>
    )}}
  </Query>
)

export default Title
