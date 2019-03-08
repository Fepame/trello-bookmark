import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'
import { getDefaultLocations } from '../../../services/utils'

const normalizePath = path => {
  if(path) {
    const [teamId, boardId, listId] = path.split('/')
    return teamId === "null" ? [null, boardId, listId] : [teamId, boardId, listId]
  } else {
    return []
  }
}

const Settings = ({ locationTree }) => {
  const defaultsData = getDefaultLocations()
  console.log(defaultsData)
  Object.keys(defaultsData).map(
    (site, i) => console.log(defaultsData[site])
  )

  return (
    <Row type="flex" justify="space-around">
      <Col span={22} offset={1}>
        <Divider>Default locations</Divider>
        {
          Object.keys(defaultsData)
            .filter(site => site !== 'lastLocation')
            .map(
              (site, i) => <LocationDefault
                locationTree={locationTree}
                key={i}
                site={site}
                path={normalizePath(defaultsData[site])}
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