import React from 'react'
import ReactDOM from 'react-dom'
import qs from 'qs'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import oneline from 'oneline'
// import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { persistCache } from 'apollo-cache-persist'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider, Query } from 'react-apollo'
import { RestLink } from 'apollo-link-rest'
import { GET_BOARDS, GET_TEAMS } from './services/queries'
import resolvers from './services/resolvers'
import defaults from './services/defaults'
import MainPage from './components/pages/main'
import SettingsPage from './components/pages/settings'
import NoMatchPage from './components/pages/no_match'
import { closeTab } from './services/browser'
import { generateBlob, normalizeLocationTree } from './services/utils'
import './index.css'

const restLink = new RestLink({
  uri: 'https://api.trello.com/1/',
  customFetch: (uri, options) => new Promise((resolve, reject) => {
    const combiner = uri.includes("?") ? "&" : "?"

    fetch(
      `${uri}${combiner}key=${process.env.REACT_APP_TRELLO_API_KEY}&token=${localStorage.getItem("token")}`,
      options
    ).then(
      r => resolve(r)
    )
  }),
  bodySerializers: {
    form: ({ url, cover }) => {
      const formData = new FormData()
      if(url) formData.append("url", url)
      if(cover) {
        formData.append(
          "file",
          generateBlob(cover),
          "cover.jpg"
        )
      }
      
      return {body: formData}
    }
  }
})

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  link: restLink,
  resolvers
})

persistCache({
  cache,
  debounce: 0,
  storage: window.localStorage
}).then(() => {
  defaults.init(client)
})


const App = () => {
  const { window: { location: { href, hash }}} = window
  let token = localStorage.getItem("token") 

  if (hash.includes("#token")) {
    const parsedHash = qs.parse(hash)
    localStorage.setItem("token", parsedHash['#token'])
    // window.location.href = origin
    document.body.innerText = 'Access granted'
    window.setTimeout(() => {
      window.close()
    }, 1000)
    return null
  }

  const getToken = () => {
    window.open(
      oneline`
        https://trello.com/1/authorize
          ?expiration=never
          &callback_method=fragment
          &name=Trello%20Bookmark
          &scope=read,write,account&response_type=token
          &key=${process.env.REACT_APP_TRELLO_API_KEY}
          &redirect_uri=${encodeURIComponent(href)}
      `,
      '_blank'
    )
    closeTab()
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <div className="App">
          {token 
            ? (
              <Query query={GET_TEAMS}>
                {({data: { teams }}) => {
                  if(!teams) return 'Loading...'
                  return <Query query={GET_BOARDS}>
                    {({ data: { boards }, client }) => {
                      if(!boards) return 'Loading...'
                      const locationTree = normalizeLocationTree({ boards, teams })

                      return (
                        <Switch>
                          <Route path="/index.html" exact render={(props) => <MainPage {...props} locationTree={locationTree} />} />
                          <Route path="/" exact render={(props) => <MainPage {...props} locationTree={locationTree} />} />
                          <Route path="/settings" exact render={(props) => <SettingsPage {...props} locationTree={locationTree} />} />
                          <Route component={NoMatchPage} />
                        </Switch>
                      )
                    }}
                  </Query>
                }}
              </Query> 
            ) : getToken()
          }
        </div>
      </ApolloProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))