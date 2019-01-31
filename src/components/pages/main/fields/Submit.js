import React from 'react'
import moment from 'moment'
import qs from 'qs'
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
            disabled={!card.listId || !card.title}
            onClick={() => {
              const params = qs.stringify({
                name: card.title,
                desc: card.description,
                pos: card.position,
                due: card.dueDate && moment(
                  `${card.dueDate} ${card.dueTime}`,
                  "DD.MM.YYYY HH:mm"
                ).toISOString(),
                idLabels: card.labels.join(','),
                idMembers: card.assignees.join(','),
                idList: card.listId
              })

              submitCard({
                variables: {
                  credentials,
                  params
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