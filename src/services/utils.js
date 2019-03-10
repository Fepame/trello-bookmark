import moment from 'moment'
import qs from 'qs'

export const validateLastLocation = (card, locationTree) => {
  const { teamId, boardId, listId } = card
  const isTeamValid = locationTree
    .some(team => team.id === teamId)

  if(!isTeamValid) return false

  const isBoardValid = locationTree
    .find(team => team.id === teamId)
    .children
    .some(board => board.id === boardId)

  if(!isBoardValid) return false

  const isListValid = locationTree
    .find(team => team.id === teamId)
    .children
    .find(board => board.id === boardId)
    .children
    .some(list => list.id === listId)

  if(!isListValid) return false
  return true
}

export const objectWithoutKey = (object, key) => {
  const {[key]: deletedKey, ...otherKeys} = object
  return otherKeys
}

export const pathStrToArray = path => {
  if(path) {
    const [teamId, boardId, listId] = path.split('/')
    return teamId === "null" ? [null, boardId, listId] : [teamId, boardId, listId]
  } else {
    return []
  }
}

export const pathArrayToStr = path => {
  if(path.length && path.length === 3) {
    const [ teamId, boardId, listId ] = path
    return `${teamId}/${boardId}/${listId}`
  } else {
    return ''
  }
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