import React from 'react'
import { Row, Col, Icon, Divider, Select } from 'antd'
import { Link } from 'react-router-dom'

const Settings = () => (
  <Row type="flex" justify="space-around">
    <Col span={22} offset={1}>
      <Divider>Card location</Divider>
      <Row>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={['a10', 'c12']}
        >
          {[]}
        </Select>
      </Row>
      <Link to="/">
        <Icon type="arrow-left" />
      </Link>
    </Col>
  </Row>
)

export default Settings