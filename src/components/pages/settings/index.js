import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'
import { pathStrToArray } from '../../../services/utils'
import { getLocations } from '../../../services/ls'

const locations = getLocations()

const Settings = ({ locationTree }) => (
  <Row type="flex" justify="space-around">
    <Col span={22} offset={1}>
      <Divider>Default locations</Divider>
      {
        Object.keys(locations)
          .map(
            (site, i) => <LocationDefault
              key={i}
              site={site}
              locationTree={locationTree}
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

export default Settings