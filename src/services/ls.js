import { objectWithoutKey } from './utils'

export const getLocations = () => {
  const locations = localStorage.getItem("locations")
  if(locations) {
    return JSON.parse(locations)
  } else {
    const defaultLocations = {
      'lastLocation': '',
      'newTab': '',
      'pikabu.ru': ''
    }
    localStorage.setItem("locations", JSON.stringify(defaultLocations))
    return defaultLocations
  }
}

export const setLocation = (site, path) => {
  const locations = getLocations()
  locations[site] = path
  localStorage.setItem("locations", JSON.stringify(locations))
}

export const removeLocation = site => {
  const locations = getLocations()
  if(locations[site]) {
    const newLocations = objectWithoutKey(locations, site)
    localStorage.setItem("locations", JSON.stringify(newLocations))
  }
}