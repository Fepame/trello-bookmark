import React from 'react'
import { Row, Col, Input, Cascader, Icon } from 'antd'
import { setLocation } from '../../../../services/ls'

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

export default ({ locationTree, site, path }) => (
  <Row style={{ marginBottom: 20 }}>
    <Col span={8}>
      <Input
        disabled={site === 'newTab' || site === 'lastLocation'}
        placeholder="Url contains"
        style={{ width: '100%' }}
        value={getSiteName(site)}
      />
    </Col>
    <Col offset={1} span={13}>
      <Cascader
        autoFocus
        disabled={site === 'lastLocation'}
        options={locationTree}
        defaultValue={path || []}
        style={{width: '100%'}}
        fieldNames={{ label: 'name', value: 'id' }}
        expandTrigger="hover"
        placeholder="Select card location"
        popupClassName="cascader-popup"
        allowClear={false}
        showSearch={{ filter }}
        onChange={path => {
          const [ teamId, boardId, listId] = path
          setLocation(site, `${teamId}/${boardId}/${listId}`)
        }}
      />
    </Col>
    <Col span={1} offset={1}>
      <Icon type="plus-circle" />
    </Col>
  </Row>
)
