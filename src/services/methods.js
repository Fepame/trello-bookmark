import { buildURL, generateBlob } from "./utils"

export const getCardAssignee = (cardAssignee, memberId) => 
  cardAssignee.includes(memberId)
    ? cardAssignee.filter(id => id !== memberId)
    : [...cardAssignee, memberId]

export const getSelectedLabels = (selectedLabels, labelId) =>
  selectedLabels.includes(labelId)
    ? selectedLabels.filter(label => label !== labelId)
    : [...selectedLabels, labelId]

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

export const fetchLabels = (board, callback) => 
  fetch(buildURL(`boards/${board.id}/labels`))
    .then(response => response.json())
    .then(labels => callback(labels))

export const fetchLists = (board, callback) =>
  fetch(buildURL(`boards/${board.id}/lists`))
    .then(response => response.json())
    .then(lists => callback(lists))

export const fetchMember = (member, callback) =>
  fetch(buildURL(`member/${member.idMember}`))
    .then(response => response.json())
    .then(boardMember => callback(boardMember))

export const uploadAttachment = (
  cardId, attachmentType, imageSrc, link, callback
) => {
  const formData = new FormData()
  if (attachmentType === 'LINK') {
    formData.append("url", link)
  } else if (attachmentType === 'IMAGE') {
    formData.append(
      "file",
      generateBlob(imageSrc),
      "trello-capture-screenshot.jpg"
    )
  }
  
  fetch(
    buildURL(`cards/${cardId}/attachments`), {
      method: 'POST',
      body: formData
    }
  )
  .then(response => response.json())
  .then(callback)
}