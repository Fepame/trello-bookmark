import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { SUBMIT_CARD } from '../../../../services/mutations'
import { GET_CARD } from '../../../../services/queries'
import { credentials } from '../../../../services/utils'
import { Button } from 'antd'

const Submit = ()  => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
        <Mutation mutation={SUBMIT_CARD}>
          {submitCard => <Button
            type="primary"
            disabled={!card.listId}
            onClick={() => {
              submitCard({
                variables: {
                  credentials,
                  params: `idList=${card.listId}&name=${card.title}`
                }
              })
            }}
          >
            Save
          </Button>}
        </Mutation>
      )
    }}
  </Query>
)

export default Submit