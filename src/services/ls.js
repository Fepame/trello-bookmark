export const getLocations = () => {
  const locations = localStorage.getItem("locations")
  if(locations) {
    return JSON.parse(locations)
  } else {
    const defaultLocations = [
      {id: 0, site: 'lastLocation', pathStr: '', __typename: "Location"},
      {id: 1, site: 'newTab', pathStr: '', __typename: "Location"},
      {id: 2, site: 'pikabu.ru', pathStr: '', __typename: "Location"}
    ]
    localStorage.setItem("locations", JSON.stringify(defaultLocations))
    return defaultLocations
  }
}

export const saveLocations = locations => {
  localStorage.setItem("locations", JSON.stringify(locations))
}