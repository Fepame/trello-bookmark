import React from 'react'
import { Row, Col, Icon, Divider, Popconfirm, Button } from 'antd'
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
          <Col span={22} offset={1}>
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
            <Divider />
            <Row type="flex">
              <Col span={12}>
                <Popconfirm
                  title="Are you sure? Your personal settings will be deleted."
                  onConfirm={() => {
                    window.localStorage.clear()
                    closeTab()
                  }}
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"
                >
                  <a href="#">Logout</a>
                </Popconfirm>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
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
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    }}
  </Query>
)

export default Settings