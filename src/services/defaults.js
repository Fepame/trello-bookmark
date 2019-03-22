import { isChromeExtension, getTabInfo } from '../services/browser'
import { getLocations } from '../services/ls'
import { pathStrToArray } from '../services/utils'
import gql from 'graphql-tag'

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
    {id: 2, site: 'localhost', pathStr: 'null/5c383fd63116310f3c27c1a7/5c383fe4aff38b2ff18d3397', __typename: "Location"}
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
  const foundSite = locations
    .find(({ site }) => site && url.includes(site))
  const [ newTab ] = locations
    .filter(location => location.site === 'newTab')
  const [ lastLocation ] = locations
    .filter(location => location.site === 'lastLocation')

  if (url === 'chrome://newtab/') {
    return pathStrToArray(newTab.pathStr)
  } else if (foundSite) {
    return pathStrToArray(foundSite.pathStr)
  } else if (lastLocation) {
    return pathStrToArray(lastLocation.pathStr)
  } else {
    return []
  }
}

const updateCard = (client, card) => {
  const { locations } = client.readQuery({
    query: gql`{
      locations {
        id
        site
        pathStr
      }
    }`
  })
  const foundedPath = getFoundPath(card.link, locations)
  if(foundedPath.length) {
    const [teamId, boardId, listId] = foundedPath
    client.writeData({ 
      data: {
        card: {
          ...card,
          teamId,
          boardId,
          listId,
          __typename: "Card",
        }
      }
    })
  } else {
    client.writeData({ 
      data: {
        card: {
          ...card,
          __typename: "Card",
        }
      }
    })
  }
}

export default {
  init: client => {
    const storedData = localStorage.getItem("apollo-cache-persist")
    
    if(!storedData) {
      client.writeData({ data: defaultData })
    }
    
    if(isChromeExtension){
      getTabInfo(tabInfo => {
        if(!tabInfo.link !== 'chrome://newtab') {
          updateCard(client, tabInfo)
        }
      })
    } else {
      updateCard(client, {
        title: document.title,
        link: window.location.href
      })
    }
  }
} 