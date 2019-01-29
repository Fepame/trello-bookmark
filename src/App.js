import React from 'react'
import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { RestLink } from 'apollo-link-rest'
import { withClientState } from 'apollo-link-state'
import resolvers from './services/resolvers'
import defaults from './services/defaults'
import Layout from './components/Layout'

const restLink = new RestLink({
  uri: 'https://api.trello.com/1/',
})

const cache = new InMemoryCache()

const stateLink = withClientState({ 
  cache,
  defaults,
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
      <Layout />
    </div>
  </ApolloProvider>
)

export default App