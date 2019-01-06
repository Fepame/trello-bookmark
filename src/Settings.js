import React, { Component } from 'react'
import { Alert } from 'antd'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount = () => {
    localStorage.setItem("token", window.location.hash.split("=").pop())

    setTimeout(() => {
      window.close()
    }, 1000);
  }

  render(){
    return (
      <Alert message="Your token has been generated" type="success" />
    )
  }
}

export default Settings