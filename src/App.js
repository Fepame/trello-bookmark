import React from 'react'
import {
  Row,
  Divider,
  Col
} from 'antd'
import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { RestLink } from 'apollo-link-rest'
import { withClientState } from 'apollo-link-state'
import resolvers from './services/resolvers'

import FieldWrapper from './components/FieldWrapper'
import Location from './components/Location'
import Position from './components/Position'
import Title from './components/Title'
import Link from './components/Link'

const restLink = new RestLink({
  uri: 'https://api.trello.com/1/members/me/',
})

const cache = new InMemoryCache()

const stateLink = withClientState({ 
  cache,
  defaults: {
    card: {
      __typename: "Card",
      position: "top",
      link: "http...",
      title: "Some title"
    }
  },
  resolvers
})

const link = ApolloLink.from([
  restLink,
  stateLink
])

const client = new ApolloClient({
  link,
  cache
})

const App = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <Row type="flex" justify="space-around">
        <Col span={22}>
          <Divider>Card location</Divider>
          <Row>
            <Col span={17}>
              <Location />
            </Col>
            <Col span={6} offset={1}>
              <FieldWrapper>
                {props => <Position {...props} />}
              </FieldWrapper>
            </Col>
          </Row>
          
          <Divider>Card details</Divider>
          <Row>
            <Col span={11}>
              <FieldWrapper>
                {props => <Title {...props} />}
              </FieldWrapper>
            </Col>
            
            <Col span={11}>
              <FieldWrapper>
                {props => <Link {...props} />}
              </FieldWrapper>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </ApolloProvider>
)

export default App