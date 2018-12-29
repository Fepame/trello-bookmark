import React, { Component } from 'react'
import Trello from 'trello'
import { Input, Select, Radio, Form, Row, Col, Icon, Tag, Avatar } from 'antd'
const { TextArea } = Input
const { Option } = Select
const { Group } = Radio
const { CheckableTag } = Tag;

const trello = new Trello(
  process.env.REACT_APP_TRELLO_API_KEY,
  process.env.REACT_APP_TRELLO_TOKEN
);

const getAvatarURL = hash => `http://trello-avatars.s3.amazonaws.com/${hash}/170.png`

class App extends Component {
  constructor(props) {
    super(props)

    console.log(process.env.REACT_APP_TRELLO_TOKEN)

    this.state = {
      currentBoardId: "",
      boards: [],
      currentLabels: new Set(),
      avatarURLs: new Set()
    }
  }
  
  componentDidMount = () => this.GetBoards()

  onBoardChange = id => {
    let { avatarURLs } = this.state
    const { boards } = this.state
    avatarURLs.clear()
    this.setState({
      currentBoardId: id,
      avatarURLs
    })
    boards
      .filter(board => board.id === id)
      .map(board => 
        board.memberships.map(member => 
          this.GetMember(member.idMember)
        )
      )
  }
  
  onLabelChange = (label, checked) => {
    let { currentLabels } = this.state
    checked
    ? currentLabels.add(label)
    : currentLabels.delete(label)
    this.setState({currentLabels})
  }

  GetMember = memberId => {
    trello.getMember(memberId, (error, member) => {
        let { avatarURLs } = this.state
        if (error) {
          console.log('Could not fetch member:', error)
        } else {
          avatarURLs.add(getAvatarURL(member.avatarHash))
          this.setState({avatarURLs})
        }
    });
  }

  GetBoards = () => {
      trello.getBoards('me', (error, boards) => {
          if (error) {
              console.log('Could not fetch boards:', error)
          } else {
            this.setState({
              boards: boards.filter(board => !board.closed && !board.idOrganization)
            })
            this.onBoardChange("5ba3f5c0a3adf352ead8d4dd")
            console.log(boards.filter(board => board.id === this.state.currentBoardId)[0])
          }
      });
  }

  render() {
    const { boards, currentBoardId, currentLabels, avatarURLs } = this.state
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
                <Group defaultValue="a" buttonStyle="solid">
                  <Radio.Button value="a">Top</Radio.Button>
                  <Radio.Button value="b">Bottom</Radio.Button>
                </Group>
              </Form.Item>

              <Form.Item>
                {!!boards.length && boards
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
                {!!avatarURLs.size && 
                  [...avatarURLs].map(url => <Avatar src={url} key={url} />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App