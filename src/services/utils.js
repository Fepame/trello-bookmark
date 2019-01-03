export const hexColor = {
  black: "#355263",
  blue: "#0079bf",
  green: "#61bd4f",
  lime: "#51e898",
  orange: "#ff9f1a",
  pink: "#ff78cb",
  purple: "#c377e0",
  red: "#eb5a46",
  sky: "#00c2e0",
  yellow: "#f2d600"
}

export const buildURL = (link, query) => {
  const url = new URL(`https://api.trello.com/1/${link}`)
  url.search = new URLSearchParams(
    Object.assign({
      key: process.env.REACT_APP_TRELLO_API_KEY,
      token: process.env.REACT_APP_TRELLO_TOKEN
    }, query)
  )
  return url
}

export const getAvatarURL = hash => `http://trello-avatars.s3.amazonaws.com/${hash}/170.png`

export const generateBlob = imageData => {
  var imageDataElements = imageData.split(',')
    , mimeType = imageDataElements[0].split(':')[1].split(';')[0]
    , imageB64Data = imageDataElements[1]
    , byteString = atob(imageB64Data)
    , length = byteString.length
    , ab = new ArrayBuffer(length)
    , ua = new Uint8Array(ab)
    , i
    ;

  for (i = 0; i < length; i++) {
      ua[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}