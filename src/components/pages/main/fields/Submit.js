import React from 'react'
import moment from 'moment'
import qs from 'qs'
import { Query, Mutation } from 'react-apollo'
import { SUBMIT_CARD, SUBMIT_CARD_ATTACHMENT, SET_SETTING } from '../../../../services/mutations'
import { GET_CARD } from '../../../../services/queries'
import { Button } from 'antd'

const Submit = ()  => (
  <Mutation mutation={SET_SETTING}>
    {setSetting => <Query query={GET_CARD}>
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

                  setSetting({
                    variables: {
                      fieldName: "spinner",
                      fieldValue: {
                        type: "loading",
                        isVisible: true,
                        __typename: "Spinner"
                      },
                      __typename: "Settings"
                     }
                  })

                  const onSubmitSuccess = () => {
                    setSetting({
                      variables: {
                        fieldName: "spinner",
                        fieldValue: {
                          type: "check-circle",
                          isVisible: true,
                          __typename: "Spinner"
                        },
                        __typename: "Settings"
                      }
                    })

                    window.setTimeout(() => {
                      setSetting({
                        variables: {
                          fieldName: "spinner",
                          fieldValue: {
                            type: "loading",
                            isVisible: false,
                            __typename: "Spinner"
                          },
                          __typename: "Settings"
                        }
                      })
                    }, 300)
                  }

                  submitCard({
                    variables: {
                      params
                    }
                  }).then(response => {
                    const { data: { submitCard: { id }}} = response
                    const submit = data => submitCardAttachment({
                      variables: {
                        data: data,
                        cardId: id
                      }
                    })

                    if(card.link && card.cover) {
                      submit({
                        url: card.link,
                      }).then(() => submit({
                        cover: card.cover
                      })).then(() => onSubmitSuccess())
                    } else if (card.link) {
                      submit({
                        url: card.link
                      }).then(() => onSubmitSuccess())
                    } else if (card.cover) {
                      submit({
                        cover: card.cover
                      }).then(() => onSubmitSuccess())
                    } else {
                      onSubmitSuccess()
                    }
                  })
                }}
              >
                Save
              </Button>}
            </Mutation>}
          </Mutation>
        )
      }}
    </Query>}
  </Mutation>
)

export default Submit