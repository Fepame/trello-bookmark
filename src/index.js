import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Settings from './Settings'

const { location } = window
const currentURL = location.href

if(localStorage.getItem("token")){
  ReactDOM.render(<App />, document.getElementById('root'))
} else {
  if(currentURL.includes("token")) {
    ReactDOM.render(<Settings />, document.getElementById('root'))
  } else {
    window.open(
      `https://trello.com/1/authorize?expiration=never&callback_method=fragment&name=Trello%20Bookmark&scope=read,write,account&response_type=token&key=${process.env.REACT_APP_TRELLO_API_KEY}&redirect_uri=${encodeURIComponent(currentURL)}`,
      '_blank'
    )
  }
}
