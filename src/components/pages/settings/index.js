import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'
import { getDefaultLocations, normalizePath } from '../../../services/utils'


const defaultsData = getDefaultLocations()

const Settings = ({ locationTree }) => (
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

export default Settings