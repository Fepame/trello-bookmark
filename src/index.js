import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { RestLink } from 'apollo-link-rest'
import { withClientState } from 'apollo-link-state'
import resolvers from './services/resolvers'
import defaults from './services/defaults'
import MainPage from './components/pages/main'
import SettingsPage from './components/pages/settings'
import './index.css'

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
  <BrowserRouter>
    <ApolloProvider client={client}>
      <div className="App">
        <Route path="/" exact component={MainPage} />
        <Route path="/settings" exact component={SettingsPage} />
      </div>
    </ApolloProvider>
  </BrowserRouter>
)

ReactDOM.render(<App />, document.getElementById('root'))