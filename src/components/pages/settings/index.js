import React from 'react'
import { Row, Col, Icon, Divider, Input, Cascader } from 'antd'
import { Link } from 'react-router-dom'

const filter = (inputValue, path) => path
  .some(option => 
    option
    .name
    .toLowerCase()
    .indexOf(
      inputValue.toLowerCase()
    ) > -1
  )

const Settings = ({ locationTree }) => (
  <Row type="flex" justify="space-around">
    <Col span={22} offset={1}>
      <Divider>Default locations</Divider>
      <Row style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Input
            placeholder="Url contains"
            style={{ width: '100%' }}
          />
        </Col>
        <Col offset={1} span={13}>
          <Cascader
            autoFocus
            options={locationTree}
            style={{width: '100%'}}
            fieldNames={{ label: 'name', value: 'id' }}
            expandTrigger="hover"
            placeholder="Select card location"
            popupClassName="cascader-popup"
            allowClear={false}
            showSearch={{ filter }}
            onChange={path => {
              const [ teamId, boardId, listId ] = path
              console.log(teamId, boardId, listId)
            }}
          />
        </Col>
        <Col span={1} offset={1}>
          <Icon type="plus-circle" />
        </Col>
      </Row>
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