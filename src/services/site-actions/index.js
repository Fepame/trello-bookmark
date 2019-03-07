import { isYouTube, getYoutubeCover, getYoutubeVideoId } from './youtube'

export const getCardParams = ({ url, title }) => new Promise(
  resolve => {
    const cardData = {
      data: {
        card: {
          link: url,
          title,
          __typename: "Card"
        }
      }
    }
    if (isYouTube(url)) {
      console.log("isYouTube")
      return getYoutubeCover(getYoutubeVideoId(url)).then(cover => resolve({
        ...cardData, data: {
          ...cardData.data, card: {
            ...cardData.data.card, cover
          }
        }
      }))
    }
    console.log("not yotube")
  
    resolve(cardData)
  }
)