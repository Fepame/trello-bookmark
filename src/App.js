import React, { Component } from 'react'
import {
  Select,
  Row,
  Divider,
  Modal,
  Col
} from 'antd'
import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { RestLink } from 'apollo-link-rest'
import { withClientState } from 'apollo-link-state'
import Settings from "./Settings"
import Teams from './components/Teams'

const restLink = new RestLink({
  uri: 'https://api.trello.com/1/members/me/',
})

const defaults = {
  teams: [],
  currentTeamId: '',
}

const cache = new InMemoryCache()

const link = ApolloLink.from([
  restLink,
  withClientState({ 
    defaults,
    cache
  })
])

const client = new ApolloClient({
  link,
  cache
})

const generateList = teams => console.log(teams)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      teams: [],
    }
  }
  
  componentDidMount = () => {
    
  }

  toggleModal = modalVisible => this.setState({modalVisible})

  render() {
    const {
      teams,
      modalVisible
    } = this.state

    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Row type="flex" justify="space-around">
            <Col span={22}>
              <Divider>Card location</Divider>
              <Row>
                <Col span={7} offset={1}>
                  {/* <Select 
                    showSearch
                    optionFilterProp="children"
                    placeholder="Select a board"
                    style={{width: '100%'}}
                  >
                    {generateList(teams)}
                  </Select> */}
                  <Teams />
                </Col>
              </Row>
            </Col>
          </Row>
          <Modal
            title="Plugin info"
            visible={modalVisible}
            footer={null}
            onCancel={() => this.toggleModal(false)}
          >
            <Settings />
          </Modal>
        </div>
      </ApolloProvider>
    )
  }
}

export default App