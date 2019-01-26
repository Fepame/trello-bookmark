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

import Location from './components/Location'

const restLink = new RestLink({
  uri: 'https://api.trello.com/1/members/me/',
})

const cache = new InMemoryCache()

const stateLink = withClientState({ 
  cache,
  defaults: {},
  resolvers: {}
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
            <Col span={24}>
              <Location />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </ApolloProvider>
)

export default App