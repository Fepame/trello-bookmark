import React from 'react'
import ReactDOM from 'react-dom'
import qs from 'qs'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
// import { persistCache } from 'apollo-cache-persist'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { RestLink } from 'apollo-link-rest'
import resolvers from './services/resolvers'
import defaults from './services/defaults'
import MainPage from './components/pages/main'
import SettingsPage from './components/pages/settings'
import NoMatchPage from './components/pages/no_match'
import { generateBlob, getTabInfo } from './services/utils'
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

// persistCache({
//   cache,
//   storage: window.localStorage
// })

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  link: restLink,
  resolvers
})

client.writeData({ data: defaults })

getTabInfo(({title, url}) => client.writeData({ 
  data: {
    card: {
      title,
      link: url,
      __typename: "Card"
    }
  }
}))

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

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <div className="App">
          {token 
            ? (
              <Switch>
                <Route path="/" component={MainPage} />
                <Route path="/settings" exact component={SettingsPage} />
                <Route component={NoMatchPage} />
              </Switch>
            )
            : window.open(
              `https://trello.com/1/authorize?expiration=never&callback_method=fragment&name=Trello%20Bookmark&scope=read,write,account&response_type=token&key=${process.env.REACT_APP_TRELLO_API_KEY}&redirect_uri=${encodeURIComponent(href)}`,
              '_blank'
            )
          }
          
        </div>
      </ApolloProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))