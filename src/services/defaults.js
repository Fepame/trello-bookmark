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
  locations: [
    {id: 0, site: 'lastLocation', pathStr: '', __typename: "Location"},
    {id: 1, site: 'newTab', pathStr: '', __typename: "Location"},
    {id: 2, site: 'pikabu.ru', pathStr: '', __typename: "Location"}
  ],
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
  const foundSite = Object.keys(locations)
    .find(site => site && url.includes(site))

  if (url === 'chrome://newtab/') {
    return pathStrToArray(locations.newTab)
  } else if (foundSite) {
    return pathStrToArray(locations[foundSite])
  } else if (locations.lastLocation) {
    return pathStrToArray(locations.lastLocation)
  } else {
    return []
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