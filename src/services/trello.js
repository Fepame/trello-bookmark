
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