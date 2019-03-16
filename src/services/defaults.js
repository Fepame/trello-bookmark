import { getTabInfo } from '../services/browser'
import { getLocations } from '../services/ls'
import { pathStrToArray } from '../services/utils'

const defaultData = {
  settings: {
    __typename: "Settings",
    spinner: {
      type: "loading",
      isVisible: false,
      __typename: "Spinner"
    },
  },
  card: {
    __typename: "Card",
    position: "top",
    link: '',
    title: '',
    description: '',
    boardId: '',
    teamId: null,
    cover: '',
    listId: '',
    dueDate: '',
    dueTime: '12:00',
    labels: [],
    assignees: []
  }
}

const getFoundPath = (url, locations) => {
  const foundSite = locations
    .find(({ site }) => site && url.includes(site))

  if (url === 'chrome://newtab/') {
    return pathStrToArray(
      locations.find(({site}) => site === 'newTab').pathStr
    )
  } else if (foundSite) {
    return pathStrToArray(foundSite.pathStr)
  } else {
    return pathStrToArray(
      locations.find(({site}) => site === "lastLocation").pathStr
    )
  }
}

const updateCardWithPath = (path, cardDefaults) => {
  const [teamId, boardId, listId] = path
  return {
    ...cardDefaults,
    teamId,
    boardId,
    listId
  }
}

export default {
  init: client => {
    getTabInfo(({title, url}) => {
      const locations = getLocations()
      const foundPath = getFoundPath(url, locations)
      let defaults = {
        ...defaultData,
        locations,
        card: {
          ...defaultData.card,
          title,
          link: url
        }
      }

      if(foundPath.length) {
        defaults.card = updateCardWithPath(foundPath, defaults.card)
      }

      client.writeData({ data: defaults })
    })
  }
} 