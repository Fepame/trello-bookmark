import React from 'react'
import { Row, Col, Input, Cascader, Icon } from 'antd'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { pathArrayToStr, pathStrToArray } from '../../../../services/utils'

const filter = (inputValue, path) => path
  .some(option => 
    option
    .name
    .toLowerCase()
    .indexOf(
      inputValue.toLowerCase()
    ) > -1
  )

const getSiteName = site => {
  if(site === 'lastLocation') {
    return 'Last saved location:'
  } else if (site === 'newTab') {
    return 'New tab:'
  } else {
    return site
  }
}

export default ({
  locationTree,
  locationId,
  isLastRow
}) => (
  <Query query={gql`{ locations { id site pathStr }}`}>
    {({ data: { locations }, client }) => {
      if(!locations) return null
      const [{ site, pathStr }] = locations
        .filter(location => location.id === locationId)
      return (
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Input
              disabled={site === 'newTab' || site === 'lastLocation'}
              placeholder="Url contains"
              style={{ width: '100%' }}
              value={getSiteName(site)}
              // onChange={e => updateLocation(e.target.value, path, site)}
            />
          </Col>
          <Col offset={1} span={11}>
            <Cascader
              autoFocus
              disabled={site === 'lastLocation'}
              options={locationTree}
              value={pathStrToArray(pathStr)}
              style={{width: '100%'}}
              fieldNames={{ label: 'name', value: 'id' }}
              expandTrigger="hover"
              placeholder="Select card location"
              popupClassName="cascader-popup"
              allowClear={false}
              showSearch={{ filter }}
              onChange={path => client.writeData({
                data: {
                  locations: locations
                    .map(location => {
                      if(location.site === site){
                        const newLocation = {
                          ...location,
                          pathStr: pathArrayToStr(path)
                        }
                        return newLocation
                      }

                      return location
                    })
                }
              })}
            />
          </Col>
          <Col span={1} offset={1}>
            <Icon
              style={{
                display: isLastRow ? 'inline-block' : 'none'
              }}
              type="plus-circle"
              onClick={() => client.writeData({
                data: {
                  locations: [
                    ...locations,
                    {
                      id: locations.length,
                      site: '',
                      pathStr: '',
                      __typename: "Location"
                    }
                  ]
                }
              })}
            />
          </Col>
          <Col span={1}>
            <Icon
              style={{
                display: isLastRow ? 'inline-block' : 'none'
              }}
              type="minus-circle"
              onClick={() => client.writeData({
                data: {
                  locations: locations.filter(location => location.id !== locationId)
                }
              })}
            />
          </Col>
        </Row>
      )
    }
  }
</Query>
)
