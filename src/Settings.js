import React, { Component } from 'react'
import { Alert, Row, Col } from 'antd'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasToken: false
    }
  }

  componentDidMount = () => {
    if(!localStorage.getItem("token")){
      localStorage.setItem("token", window.location.hash.split("=").pop())
      this.setState({hasToken: true})
      
      setTimeout(() => {
        window.close()
      }, 1000);
    }
  }

  render(){
    const { hasToken } = this.state
    return (
      <Row type="flex" justify="space-around" style={{padding: '20px 0'}}>
        <Col span={24}>
          {hasToken && <Alert
            message="Your token has been generated"
            type="success" 
          />}
          <Row>
            <Col span={8}>
              <h2>Leave a Review</h2>
              <p>
                <a href="https://chrome.google.com/webstore/detail/trello-bookmark/ephoopolmejjnjkbbdcfgoohokhnekca/related">
                  Review in the Chrome Webstore
                </a>
              </p>
            </Col>
            <Col span={8}>
              <h2>Have a Suggestion?</h2>
              <p>
                Create an issue on <a href="https://github.com/dospolov/trello-bookmark/issues">GitHub</a>.
              </p>
            </Col>
            <Col span={8}>
              <h2>Follow on Github</h2>
              <p>
                Submit issues, pull requests, or just follow the development
                on <a href="https://github.com/dospolov/trello-bookmark">Github</a>.
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Settings