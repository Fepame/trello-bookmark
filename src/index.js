import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Settings from './Settings'

const { location } = window
const currentURL = location.href
let route = <App />

if(localStorage.getItem("token")){
  if (currentURL.includes("settings")){
    route = <Settings />
  }
} else {
  if(currentURL.includes("token")) {
    route = <Settings />
  } else {
    window.open(
      `https://trello.com/1/authorize?expiration=never&callback_method=fragment&name=Trello%20Bookmark&scope=read,write,account&response_type=token&key=${process.env.REACT_APP_TRELLO_API_KEY}&redirect_uri=${encodeURIComponent(currentURL)}`,
      '_blank'
    )
  }
}

ReactDOM.render(route, document.getElementById('root'))