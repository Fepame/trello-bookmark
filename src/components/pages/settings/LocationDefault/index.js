import React from 'react'
import { Row, Col, Input, Cascader, Icon, Tooltip } from 'antd'
import { pathStrToArray, pathArrayToStr, getHostname } from '../../../../services/utils'
import { getTabInfo } from '../../../../services/browser'

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
  location: { site, pathStr, id},
  locations,
  locationTree,
  client,
  isLastRow
}) => {
  const updateLocation = ({ site, pathArr }) => {
    client.writeData({
      data: {
        locations: locations.map(location => {
          if(location.id === id){
            return {
              ...location,
              site: site !== undefined ? site : location.site,
              pathStr: pathArr !== undefined 
                ? pathArrayToStr(pathArr) : location.pathStr
            }
          }
          return location
        })
      }
    })

  }
  return (
    <Row style={{ marginBottom: 20 }}>
      <Col span={1}>
        {
          site === '' 
          && <Tooltip
            title="Use current site"
            placement="right"
          >
            <Icon
              type="link"
              style={{
                marginTop: 10,
                display: (
                  site !== 'newTab' 
                  && site !== 'lastLocation'
                  && site === ''
                ) ? 'inline-block' : 'none'
              }}
              onClick={() => getTabInfo(
                tabInfo => updateLocation({
                  site: getHostname(tabInfo.link)
                }))
              }
            />
          </Tooltip>
        }
      </Col>
      <Col span={6}>
        <Input
          disabled={site === 'newTab' || site === 'lastLocation'}
          placeholder="e.g. medium.com"
          style={{ width: '100%' }}
          value={getSiteName(site)}
          onChange={e => updateLocation({
            site: e.target.value
          })}
        />
      </Col>
      <Col offset={1} span={14}>
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
          onChange={path => updateLocation({ pathArr: path })}
        />
      </Col>
      <Col span={1} style={{ textAlign: 'right '}}>
        <Icon
          style={{
            marginTop: 10,
            display: (site !== 'newTab' && site !== 'lastLocation')
              ? 'inline-block' : 'none'
          }}
          type="minus-circle"
          onClick={() => client.writeData({
            data: {
              locations: locations.filter(location => location.id !== id)
            }
          })}
        />
      </Col>
      <Col span={1} style={{ textAlign: 'right '}}>
        <Icon
          style={{
            marginTop: 10,
            display: (isLastRow && site !== 'lastLocation')
              ? 'inline-block' : 'none'
          }}
          type="plus-circle"
          onClick={() => client.writeData({
            data: {
              locations: [
                ...locations,
                {
                  id: id + 1,
                  site: '',
                  pathStr: '',
                  __typename: "Location"
                }
              ]
            }
          })}
        />
      </Col>
    </Row>
  )
}