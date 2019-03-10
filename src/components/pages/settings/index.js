import React, { useState } from 'react'
import { Button, Row, Col, Icon, Divider } from 'antd'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'
import { pathStrToArray, pathArrayToStr, objectWithoutKey } from '../../../services/utils'
import { getLocations, setLocation, removeLocation } from '../../../services/ls'

const Settings = ({ locationTree }) => {
  const [locations, setLocations] = useState(getLocations())

  const updateLocation = (site, path, oldSite) => {
    let newLocations = locations
    if(oldSite !== undefined) {
      newLocations = objectWithoutKey(locations, oldSite)
      removeLocation(oldSite)
    }
    setLocations({
        ...newLocations,
        [site]: pathArrayToStr(path)
    })
    setLocation(site, pathArrayToStr(path))
  }

  const addNewLocation = () => {
    console.log(locations, Object.keys(locations).some(site => site === ""))
    if(!Object.keys(locations).some(site => site === "")) {
      setLocations({
        ...locations,
        "": ""
      })
    }
  }

  return (
    <Row type="flex" justify="space-around">
      <Col span={22} offset={1}>
        <Divider>Default locations</Divider>
        {
          Object.keys(locations)
            .map(
              (site, i) => <LocationDefault
                key={i}
                isLastRow={i === Object.keys(locations).length - 1}
                site={site}
                locationTree={locationTree}
                updateLocation={updateLocation}
                addNewLocation={addNewLocation}
                path={pathStrToArray(locations[site])}
              />
            )
        }
        <Link to="/">
          <Icon
            type="arrow-left"
            style={{ 
              fontSize: 19,
              verticalAlign: '-webkit-baseline-middle'
            }}
          />
        </Link>
      </Col>
    </Row>
  )
}

export default Settings