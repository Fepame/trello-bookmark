import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'
import { saveLocations } from '../../../services/ls'

const removeEmptyLocations = (client, locations) => {
  const filledLocations = locations.filter(location => location.site)
  client.writeData({
    data: {
      locations: filledLocations
    }
  })
  return filledLocations
}

const Settings = ({ locationTree }) => (
  <Query query={gql`{ locations { id site pathStr }}`}>
    {({ data: { locations }, client }) => {
      if(!locations) return null
      return (
        <Row type="flex" justify="space-around">
          <Col span={22} offset={1}>
            <Divider>Default locations</Divider>
            {
              locations.map(location => <LocationDefault
                  key={location.id}
                  isLastRow={location.id === locations.length - 1}
                  locationId={location.id}
                  locationTree={locationTree}
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
                onClick={() => {
                  const filledLocations = removeEmptyLocations(client, locations)
                  saveLocations(filledLocations)
                }}
              />
            </Link>
          </Col>
        </Row>
      )
    }}
  </Query>
)

export default Settings