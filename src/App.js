import React, { Component } from 'react'
import Trello from 'trello'
import { Input, Select, Radio, Form, Row, Col, Icon, Tag } from 'antd'
const { TextArea } = Input
const { Option } = Select
const { Group } = Radio
const { CheckableTag } = Tag;

const trello = new Trello(
  "e9d4b0061c2ac9a0529240b09d88521c", // api key
  "5e410c1e8fc1c57aa6a3c4378a313131fd46977a19c39d53852698340fbbccc8" // user token
);

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentBoardId: "5ba3f5c0a3adf352ead8d4dd",
      boards: [],
      currentLabels: new Set()
    }
  }
  
  componentDidMount = () => this.GetBoards()

  onBoardChange = id => this.setState({currentBoardId: id})
  
  onLabelChange = (label, checked) => {
    let currentLabels = this.state.currentLabels
    checked
    ? currentLabels.add(label)
    : currentLabels.delete(label)
    this.setState({currentLabels})
  }

  GetBoards = () => {
      trello.getBoards('me', (error, boards) => {
          if (error) {
              console.log('Could not fetch boards:', error)
          } else {
            console.log(boards.filter(board => board.id === this.state.currentBoardId)[0])
            this.setState({
              boards: boards.filter(board => !board.closed && !board.idOrganization)
            })
          }
      });
  }

  render() {
    const { boards, currentBoardId, currentLabels } = this.state
    return (
      <div className="App">
        <Row type="flex" justify="space-around">
          <Col span={22}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Form.Item>
                <TextArea placeholder="Card title" autosize={{ minRows: 1 }} />
              </Form.Item>
              
              <Form.Item>
                <Input placeholder="Link" addonAfter={<Icon type="link" />} />
              </Form.Item>
              
              <Form.Item>
                <TextArea placeholder="Card description" autosize={{ minRows: 1 }} />
              </Form.Item>

              <Form.Item>
                <Select value={currentBoardId} onChange={this.onBoardChange}>
                  {boards.map(
                    board => 
                      <Option value={board.id} key={board.id}>{board.name}</Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item>
                {boards.length && boards
                  .filter(board => board.id === currentBoardId)
                  .map(
                    board => 
                      Object
                      .keys(board.labelNames)
                      .filter(label => board.labelNames[label])
                      .map(
                        label => <CheckableTag 
                          key={label}
                          checked={currentLabels.has(label)}
                          onChange={checked => this.onLabelChange(label, checked)}
                        >
                          {board.labelNames[label]}
                        </CheckableTag>
                      )
                  )
                }
              </Form.Item>

              <Form.Item>
                <Group defaultValue="a" buttonStyle="solid">
                  <Radio.Button value="a">Top</Radio.Button>
                  <Radio.Button value="b">Bottom</Radio.Button>
                </Group>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App