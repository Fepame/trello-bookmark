import React from 'react'
import {
  Row,
  Divider,
  Form,
  Col,
  Button
} from 'antd'

import FieldWrapper from './FieldWrapper'
import Location from './Location'
import Position from './Position'
import Title from './Title'
import Description from './Description'
import Link from './Link'
import Submit from './Submit'
import Labels from './Labels'
import DueDate from './DueDate'
import DueTime from './DueTime'
import Cover from './Cover'

const { Item } = Form

const Layout = () => (
  <Row type="flex" justify="space-around">
    <Col span={22}>
      <Divider>Card location</Divider>
      <Row>
        <Col span={17}>
          <Location />
        </Col>
        <Col span={6} offset={1}>
          <FieldWrapper>
            <Position />
          </FieldWrapper>
        </Col>
      </Row>
      
      <Divider>Card details</Divider>
      <Form layout="vertical">
        <Row>
          <Col span={11}>
            <Item>
              <FieldWrapper>
                <Title />
              </FieldWrapper>
            </Item>

            <Item>
              <FieldWrapper>
                <Link />
              </FieldWrapper>
            </Item>

            <Item>
              <FieldWrapper>
                <Cover />
              </FieldWrapper>
            </Item>
          </Col>
          <Col span={11} offset={2}>
            <Item>
              <FieldWrapper>
                <Description />
              </FieldWrapper>
            </Item>

            <Item>
              <FieldWrapper>
                <Labels />
              </FieldWrapper>
            </Item>

            <Item>
              <Row type="flex" justify="space-around">
                <Col span={13}>
                  <FieldWrapper>
                    <DueDate />
                  </FieldWrapper>
                </Col>
                <Col span={10} offset={1}>
                  <FieldWrapper>
                    <DueTime />
                  </FieldWrapper>
                </Col>
              </Row>
            </Item>

            <Item>
              Assignees
            </Item>
          </Col>
        </Row>
        <Divider />

        <Row type="flex" justify="space-around">
          <Col span={12}>
            help
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button style={{marginRight: 10}}>Cancel</Button>
            <Submit />
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
)

export default Layout