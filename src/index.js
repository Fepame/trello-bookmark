import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const { location, history } = window
const currentURL = location.href

if(!localStorage.getItem("token")){
  if(currentURL.includes("token")) {
    localStorage.setItem("token", location.hash.split("=").pop())
    history.pushState({}, null, location.origin)
  } else {
    location.href = `https://trello.com/1/authorize?expiration=never&name=Trello%20Bookmark&scope=read,write,account&response_type=token&key=${process.env.REACT_APP_TRELLO_API_KEY}&return_url=${currentURL}`
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
