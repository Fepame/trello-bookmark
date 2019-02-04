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

export const getImageSrc = (e, callback) => {
  const items = e.clipboardData.items;

  [...items].map(item => {
    if (item.kind === 'file') {
      const blob = item.getAsFile()
      const reader = new FileReader()
      reader.onload = e => {
        const imageSrc = e.target.result
        if(/base64/.test(imageSrc)) {
          callback(imageSrc)
        }
      }
      reader.readAsDataURL(blob)
    }
    return ""
  })
}


export const getCurrentTab = callback => {
  const queryInfo = {
    active: true,
    currentWindow: true
  }

  window.chrome.tabs.query(queryInfo, tabs => {
    // send the first tab through the callback
    callback(tabs[0])
  })
}

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