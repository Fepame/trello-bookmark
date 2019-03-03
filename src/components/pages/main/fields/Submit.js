import React, { useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import { SUBMIT_CARD, SUBMIT_CARD_ATTACHMENT } from '../../../../services/mutations'
import { GET_CARD } from '../../../../services/queries'
import { resolveSubmitParams, closeTab } from '../../../../services/utils'
import { Button } from 'antd'

const Submit = ({
  card,
  onSubmitSuccess,
  updateSpinner,
  client,
  submitCard,
  submitCardAttachment
}) => {
  const onSubmitFired = () => {
    if(!card.listId || !card.title) return
    updateSpinner("loading", true)
    submitCard({
      variables: { params: resolveSubmitParams(card) }
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
  }

  useEffect(() => {
    document.onkeyup = e => {
      if(e.ctrlKey && e.key === "Enter") {
        onSubmitFired()
      }
    }
  })

  return (
    <Button
      type="primary"
      disabled={!card.listId || !card.title}
      onClick={() => onSubmitFired()}
    >
      Save
    </Button>
  )
}

export default () => (
  <Query query={GET_CARD}>
    {({ data: { card }, client }) => {
      if(!card) return null
      const updateSpinner = (type, isVisible) => client
        .writeData({
          data: {
            settings: {
              spinner: {
                type,
                isVisible,
                __typename: "Spinner"
              },
              __typename: "Settings"
            }
          }
        })

      const onSubmitSuccess = () => {
        updateSpinner("check-circle", true)
        window.setTimeout(() => {
          updateSpinner("loading", false)
          closeTab()
        }, 300)
      }

      return (
        <Mutation mutation={SUBMIT_CARD}>
          {submitCard => <Mutation mutation={SUBMIT_CARD_ATTACHMENT}>
            {submitCardAttachment => 
              <Submit
                card={card}
                submitCard={submitCard}
                submitCardAttachment={submitCardAttachment}
                updateSpinner={updateSpinner}
                onSubmitSuccess={onSubmitSuccess}
                client={client}
              />}
          </Mutation>}
        </Mutation>
      )
    }}
  </Query>
)
