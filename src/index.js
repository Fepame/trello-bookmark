import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

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