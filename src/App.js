import React, { Component } from 'react'
import Trello from 'trello'
import { Input, Select, Radio, Button, Form, Row, Col, Icon, Tag, Avatar } from 'antd'
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
      boards: [],
      currentBoardId: undefined,
      lists: [],
      currentListId: undefined,
      title: document.title,
      position: 'top',
      description: '',
      link: window.location.href,
      currentLabels: new Set(),
      boardMembers: new Set(),
      cardAssignee: []
    }
  }
  
  componentDidMount = () => trello.getBoards('me').then(boards => {
    this.setState({
      boards: boards.filter(board => !board.closed && !board.idOrganization)
    })
    this.onBoardChange("5c0e5da5f0d45186648e19d5")
    console.log([boards.filter(board => board.id === this.state.currentBoardId)])
  })

  onLinkChange = link => this.setState({link})

  onDescriptionChange = description => this.setState({description})
  
  onTitleChange = title => this.setState({title})
  
  onPositionChange = position => this.setState({position})

  onListChange = listId => this.setState({currentListId: listId})

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
      .map(board => {
        let { boardMembers } = this.state
        trello.getListsOnBoard(board.id).then(
          lists => this.setState({
            lists,
            currentListId: lists[0].id
          })
        )
        return board.memberships.map(member => 
          trello.getMember(member.idMember).then(
            boardMember => {
              boardMembers.add(boardMember)
              this.setState({boardMembers})
            }
          )
        )
      })
  }
  
  onLabelChange = (label, checked) => {
    let { currentLabels } = this.state
    checked
    ? currentLabels.add(label)
    : currentLabels.delete(label)
    this.setState({currentLabels})
  }

  onToggleBoardMember = memberId => {
    const { cardAssignee } = this.state
    this.setState({
      cardAssignee: cardAssignee.includes(memberId)
      ? cardAssignee.filter(id => id !== memberId)
      : [...cardAssignee, memberId]
    })
  }

  saveCard = () => {
    const { title, description, position, currentListId} = this.state
    trello.addCardWithExtraParams(
      title, 
      {
        desc: description,
        pos: position
      }, 
      currentListId
    ).then(card => console.log(card))
  }

  render() {
    const { 
      boards,
      currentBoardId,
      lists,
      currentListId,
      link,
      title,
      description,
      position,
      currentLabels,
      boardMembers,
      cardAssignee
    } = this.state

    return (
      <div className="App">
        <Row type="flex" justify="space-around">
          <Col span={22}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Form.Item>
                <TextArea 
                  placeholder="Card title" 
                  autosize={{ minRows: 1 }}
                  value={title}
                  onChange={e => this.onTitleChange(e.target.value)}
                />
              </Form.Item>
              
              <Form.Item>
                <Input 
                  placeholder="Link" 
                  addonAfter={<Icon type="link" />}
                  value={link}
                  onChange={e => this.onLinkChange(e.target.value)}
                />
              </Form.Item>
              
              <Form.Item>
                <TextArea 
                  placeholder="Card description" 
                  autosize={{ minRows: 2 }}
                  value={description}
                  onChange={e => this.onDescriptionChange(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Select 
                  value={currentBoardId}
                  onChange={this.onBoardChange}
                  placeholder="Select a board"
                >
                  {boards.map(
                    board => 
                      <Option value={board.id} key={board.id}>{board.name}</Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item>
                <Select 
                  value={currentListId}
                  onChange={this.onListChange}
                  placeholder="Select a list"
                >
                  {lists.map(
                    list => 
                      <Option value={list.id} key={list.id}>{list.name}</Option>
                  )}
                </Select>
              </Form.Item>
              
              <Form.Item>
                <Group 
                  value={position}
                  buttonStyle="solid"
                  onChange={e => this.onPositionChange(e.target.value)}
                >
                  <Radio.Button value="top">Top</Radio.Button>
                  <Radio.Button value="bottom">Bottom</Radio.Button>
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
                        filter: cardAssignee
                          .some(id => member.id === id)
                          ? 'none'
                          : 'grayscale(100%) contrast(50%) brightness(130%)'
                        ,
                        cursor: 'pointer'}}
                    />)}
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" onClick={this.saveCard}>Save</Button>
                {/* <Button>Cancel</Button> */}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App