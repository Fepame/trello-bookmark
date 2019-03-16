import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Query } from 'react-apollo'
import { GET_SETTINGS } from '../../../services/queries'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import LocationDefault from './LocationDefault'

const Settings = ({ locationTree }) => (
  <Query query={gql`{ locations { id }}`}>
    {({ data: { locations }, client }) => {
      if(!locations) return null
      console.log(locations)
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
              />
            </Link>
          </Col>
        </Row>
      )
    }}
  </Query>
)

export default Settings