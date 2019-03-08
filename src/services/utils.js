import moment from 'moment'
import qs from 'qs'

export const isChromeExtension = window
  .location
  .protocol === 'chrome-extension:'

export const getDefaultLocations = () => {
  const defaultLocation = localStorage.getItem("defaultLocation")
  if(defaultLocation) {
    return JSON.parse(defaultLocation)
  } else {
    const initDefaults = {
      'lastLocation': '',
      'New tab': ''
    }
    localStorage.setItem("defaultLocation", JSON.stringify(initDefaults))
    return initDefaults
  }
}

export const setDefaultLocations = (site, path) => {
  const defaultLocation = getDefaultLocations()
  defaultLocation[site] = path
  localStorage.setItem("defaultLocation", JSON.stringify(defaultLocation))
}

export const getLastLocation = () => {
  const lastLocation = localStorage.getItem("lastLocation")
  return lastLocation
    && lastLocation
      .split('/')
      .map(pathPart => pathPart === 'null' ? null : pathPart)
}

export const normalizeLocationTree = ({ teams, boards }) => [{
  id: null,
  displayName: "Private"
}, ...teams].map(team => ({
  ...team,
  name: team.displayName,
  children: boards
    .filter(board => board.idOrganization === team.id)
    .map(board => ({
      ...board,
      children: board.lists
    }))
}))



export const closeTab = () => isChromeExtension && window.close()

export const getTabInfo = cb => isChromeExtension && window
    .chrome
    .tabs
    .query(
      {
        active: true,
        currentWindow: true
      },
      tabs => !tabs[0].url.includes("chrome:") && cb(tabs[0])
    )

export const resolveSubmitParams = card => qs.stringify({
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
  const {clipboardData: { items }} = e;

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

export const generateBlob = imageData => {
  var imageDataElements = imageData.split(','),
    mimeType = imageDataElements[0].split(':')[1].split(';')[0],
    imageB64Data = imageDataElements[1],
    byteString = atob(imageB64Data),
    length = byteString.length,
    ab = new ArrayBuffer(length),
    ua = new Uint8Array(ab),
    i

  for (i = 0; i < length; i++) {
      ua[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type: mimeType })
}