import React from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Query } from 'react-apollo'
// import { GET_SETTINGS } from '../../../services/queries'
import gql from 'graphql-tag'
import { defaultData } from '../../../services/defaults'
import { closeTab } from '../../../services/browser'
import LocationDefault from './LocationDefault'

const Settings = ({ locationTree, persistor }) => (
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
            <Icon
              type="arrow-left"
              style={{ 
                fontSize: 19,
                verticalAlign: '-webkit-baseline-middle'
              }}
              onClick={() => {
                client.clearStore().then(() => {
                  client.writeData({
                    data: {
                      ...defaultData,
                      locations: locations.filter(location => location.site)
                    }
                  })
                  persistor.persist().then(() => {
                    closeTab()
                  })
                })
              }}
            />
          </Col>
        </Row>
      )
    }}
  </Query>
)

export default Settings