import React from 'react'
import {
  Row,
  Divider,
  Form,
  Spin,
  Col,
  Icon,
  Button
} from 'antd'
import { Query } from 'react-apollo'
// import { Link as RouterLink } from 'react-router-dom'
import { GET_SETTINGS } from '../../../services/queries'

import FieldWrapper from './fields/FieldWrapper'
import Location from './fields/Location'
import Position from './fields/Position'
import Title from './fields/Title'
import Description from './fields/Description'
import Link from './fields/Link'
import Submit from './fields/Submit'
import Labels from './fields/Labels'
import DueDate from './fields/DueDate'
import DueTime from './fields/DueTime'
import Cover from './fields/Cover'
import Assignees from './fields/Assignees'

const { Item } = Form

const Main = () => (
  <Query query={GET_SETTINGS}>
    {({ data: { settings }, client }) => {
      if(!settings) return null
      return (
        <Row type="flex" justify="space-around">
          <Spin
            spinning={settings.spinner.isVisible}
            indicator={
              <Icon
                type={settings.spinner.type}
                style={{ fontSize: 60 }}
                spin={settings.spinner.type === "loading"}
              />
            }
          >
            <Col span={22} offset={1}>
              <Divider>Card location</Divider>
              <Row>
                <Col span={17}>
                  <Location pathDefaults={settings.pathDefaults} />
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
                      <FieldWrapper>
                        <Assignees />
                      </FieldWrapper>
                    </Item>
                  </Col>
                </Row>
                <Divider />

                <Row type="flex" justify="space-around">
                  <Col span={12}>
                    {/* <RouterLink to="/settings">
                      <Icon type="setting" />
                    </RouterLink> */}
                  </Col>
                  <Col span={12} style={{textAlign: 'right'}}>
                    <Button style={{marginRight: 10}}>Cancel</Button>
                    <Submit />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Spin>
        </Row>
      )}}
  </Query>
)

export default Main