import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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
import NoMatchPage from './components/pages/no_match'
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

const App = () => {
  const { window: { location: { href, hash, origin }}} = window
  let token = localStorage.getItem("token") 

  if (hash.includes("#token")) {
    token = hash.split("=").pop()
    localStorage.setItem("token", token)
    window.location.href = origin
    return null
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <div className="App">
          {token 
            ? (
              <Switch>
                <Route path="/" exact component={MainPage} />
                <Route path="/settings" exact component={SettingsPage} />
                <Route component={NoMatchPage} />
              </Switch>
            )
            : window.location.href = `https://trello.com/1/authorize?expiration=never&callback_method=fragment&name=Trello%20Bookmark&scope=read,write,account&response_type=token&key=${process.env.REACT_APP_TRELLO_API_KEY}&redirect_uri=${encodeURIComponent(href)}`
          }
          
        </div>
      </ApolloProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))