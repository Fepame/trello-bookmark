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

    this.state = {
      currentBoardId: "",
      boards: [],
      link: window.location.href,
      currentLabels: new Set(),
      boardMembers: new Set(),
      currentBoardMembers: []
    }
  }
  
  componentDidMount = () => this.GetBoards()

  onBoardChange = id => {
    let { boardMembers } = this.state
    const { boards } = this.state
    boardMembers.clear()
    this.setState({
      currentBoardId: id,
      boardMembers
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

  onToggleBoardMember = memberId => {
    const { currentBoardMembers } = this.state
    this.setState({
      currentBoardMembers: currentBoardMembers.includes(memberId)
      ? currentBoardMembers.filter(id => id !== memberId)
      : [...currentBoardMembers, memberId]
    })

    console.log(this.state)
  }

  GetMember = memberId => {
    trello.getMember(memberId, (error, member) => {
        let { boardMembers } = this.state
        if (error) {
          console.log('Could not fetch member:', error)
        } else {
          console.log(member)
          boardMembers.add(member)
          this.setState({boardMembers})
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
    const { 
      boards,
      currentBoardId,
      currentLabels,
      boardMembers,
      currentBoardMembers
    } = this.state

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
                {!!boardMembers.size && 
                  [...boardMembers].map(member => 
                    <Avatar 
                      src={getAvatarURL(member.avatarHash)} 
                      key={member.id} 
                      size={64}
                      onClick={e => {
                        this.onToggleBoardMember(member.id)
                      }}
                      style={{
                        filter: currentBoardMembers
                          .some(id => member.id === id)
                          ? 'none'
                          : 'grayscale(100%) contrast(50%) brightness(150%)'
                        , 
                        cursor: 'pointer'}}
                    />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App