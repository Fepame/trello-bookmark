import React from 'react'
import { Row, Col, Input, Cascader, Icon } from 'antd'

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
  site,
  path,
  updateLocation,
  addNewLocation,
  isLastRow
}) => (
  <Row style={{ marginBottom: 20 }}>
    <Col span={8}>
      <Input
        disabled={site === 'newTab' || site === 'lastLocation'}
        placeholder="Url contains"
        style={{ width: '100%' }}
        value={getSiteName(site)}
        onChange={e => updateLocation(e.target.value, path, site)}
      />
    </Col>
    <Col offset={1} span={13}>
      <Cascader
        autoFocus
        disabled={site === 'lastLocation'}
        options={locationTree}
        value={path}
        style={{width: '100%'}}
        fieldNames={{ label: 'name', value: 'id' }}
        expandTrigger="hover"
        placeholder="Select card location"
        popupClassName="cascader-popup"
        allowClear={false}
        showSearch={{ filter }}
        onChange={path => updateLocation(site, path)}
      />
    </Col>
    <Col span={1} offset={1}>
      <Icon
        style={{
          display: isLastRow ? 'inline-block' : 'none'
        }}
        type="plus-circle"
        onClick={() => addNewLocation()}
      />
    </Col>
  </Row>
)
