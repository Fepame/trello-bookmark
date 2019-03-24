import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Query } from 'react-apollo'
// import { GET_SETTINGS } from '../../../services/queries'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'

const Settings = ({ locationTree }) => (
  <Query query={gql`{ locations { id site pathStr }}`}>
    {({ data: { locations }, client }) => {
      if(!locations) return null
      return (
        <Row type="flex" justify="space-around">
          <Col span={23} offset={1}>
            <Divider>Default locations</Divider>
            {
              locations.map((location, i) => <LocationDefault
                  key={location.id}
                  isLastRow={i === locations.length - 1}
                  location={location}
                  locations={locations}
                  locationTree={locationTree}
                  client={client}
                />
              )
            }
            <Link to="/" onClick={() => {
              client.writeData({
                data: {
                  locations: locations.filter(location => location.site)
                }
              })
            }}>
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
    }}
  </Query>
)

export default Settings