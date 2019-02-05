import React from 'react'
import moment from 'moment'
import qs from 'qs'
import { Query, Mutation } from 'react-apollo'
import { SUBMIT_CARD, SUBMIT_CARD_ATTACHMENT } from '../../../../services/mutations'
import { GET_CARD } from '../../../../services/queries'
import { Button } from 'antd'

const Submit = ()  => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      return (
        <Mutation mutation={SUBMIT_CARD}>
          {submitCard => <Mutation mutation={SUBMIT_CARD_ATTACHMENT}>
            {submitCardAttachment => <Button
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
                    params
                  }
                }).then(response => {
                  const { data: { submitCard: { id }}} = response

                  submitCardAttachment({
                    variables: {
                      data: {
                        url: card.link,
                        cover: card.cover
                      },
                      cardId: id
                    }
                  })
                })
              }}
            >
              Save
            </Button>}
          </Mutation>}
        </Mutation>
      )
    }}
  </Query>
)

export default Submit