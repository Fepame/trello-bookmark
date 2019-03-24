import React, { useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import { SUBMIT_CARD, SUBMIT_CARD_ATTACHMENT } from '../../../../services/mutations'
import { GET_CARD, GET_LOCATIONS } from '../../../../services/queries'
import { Button } from 'antd'
import { 
  resolveSubmitParams,
  pathArrayToStr
} from '../../../../services/utils'
import { defaultData } from '../../../../services/defaults'
import { closeTab } from '../../../../services/browser'

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
    
    const { locations } = client.readQuery({ 
      query: GET_LOCATIONS
    })

    client.writeData({
      data: {
        locations: locations.map(location => {
          if(location.site === 'lastLocation'){
            return {
              ...location,
              pathStr: pathArrayToStr([
                card.teamId,
                card.boardId,
                card.listId
              ])
            }
          }
          return location
        })
      }
    })

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

export default ({persistor}) => (
  <Query query={GET_CARD} fetchPolicy="cache-only">
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
          
          const { locations } = client.readQuery({ 
            query: GET_LOCATIONS
          })
          client.clearStore().then(() => {
            client.writeData({
              data: {
                ...defaultData,
                locations
              }
            })
            persistor.persist().then(() => {
              closeTab()
            })
          }) 
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
