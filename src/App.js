import React, { Component } from 'react'
import Trello from 'trello'
import { 
  Input,
  Select,
  Radio,
  message,
  Button,
  Form,
  Row,
  Col,
  Icon,
  Tag,
  Avatar
} from 'antd'
import convertCssColorNameToHex from 'convert-css-color-name-to-hex'
const { TextArea } = Input
const { Option } = Select
const { Group } = Radio

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
      labels: [],
      selectedLabels: [],
      boardMembers: [],
      cardAssignee: []
    }
  }
  
  componentDidMount = () => 
    trello
      .getBoards('me')
      .then(boards => {
        this.setState({
          boards: boards.filter(board => !board.closed && !board.idOrganization)
        })
        // 5ba3f5c0a3adf352ead8d4dd - angie
        // 5c0e5da5f0d45186648e19d5 - big short
        this.onBoardChange("5c0e5da5f0d45186648e19d5")
        console.log(boards.filter(board => board.id === this.state.currentBoardId)[0])
      })


  onLinkChange = link => this.setState({link})

  onDescriptionChange = description => this.setState({description})
  
  onTitleChange = title => this.setState({title})
  
  onPositionChange = position => this.setState({position})

  onListChange = listId => this.setState({currentListId: listId})

  clearState = () => new Promise(resolve => this.setState({
    boardMembers: [],
    lists: [],
    labels: [],
    selectedLabels: [],
    cardAssignee: []
  }, () => resolve()))

  onBoardChange = boardId => {
    this.clearState().then(() => {
      const { boards } = this.state
      this.setState({currentBoardId: boardId})
  
      boards
        .filter(board => board.id === boardId)
        .map(board => {
          trello
            .getListsOnBoard(board.id)
            .then(lists => this.setState({
              lists,
              currentListId: lists[0].id
            }))
          
          trello
            .getLabelsForBoard(boardId)
            .then(labels => this.setState({labels}))
  
          return board.memberships.map(member => trello
              .getMember(member.idMember)
              .then(boardMember => {
                const { boardMembers } = this.state
                this.setState({
                  boardMembers: [...boardMembers, boardMember]
                })}
              ))
        })
    })
  }
  
  onLabelChange = labelId => {
    const { selectedLabels } = this.state
    this.setState({
      selectedLabels: selectedLabels.includes(labelId)
        ? selectedLabels.filter(label => label !== labelId)
        : [...selectedLabels, labelId]
      })
  }

  onToggleCardAssignee = memberId => {
    const { cardAssignee } = this.state
    this.setState({
      cardAssignee: cardAssignee.includes(memberId)
      ? cardAssignee.filter(id => id !== memberId)
      : [...cardAssignee, memberId]
    })
  }

  saveCard = () => {
    const { 
      title,
      description,
      position,
      link,
      currentListId,
      selectedLabels,
      cardAssignee
    } = this.state
    trello.addCardWithExtraParams(
      title, 
      {
        desc: description,
        pos: position,
        idLabels: selectedLabels.join(','),
        idMembers: cardAssignee.join(',')
      }, 
      currentListId
    ).then(card => {
      if(link) {
        trello
          .addAttachmentToCard(card.id, link)
          .then(card => message.success("Card with link has been added"))
      } else {
        message.success("Card has been added")
      }
    })
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
      labels,
      selectedLabels,
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
              {/* convertCssColorNameToHex('aliceblue') */}
              <Form.Item>
                {!!labels.length 
                  && labels.map(
                    label =>
                      <Tag
                        color={convertCssColorNameToHex(label.color)}
                        key={label.id}
                        onClick={e => this.onLabelChange(label.id)}
                        style={{
                          filter: selectedLabels.includes(label.id)
                            ? 'none'
                            : 'grayscale(30%) opacity(90%)'
                        }}
                      >{label.name || String.fromCharCode(160) }</Tag>
                  )}
              </Form.Item>

              <Form.Item>
                {!!boardMembers.length && 
                  boardMembers.map(member => 
                    <Avatar 
                      src={getAvatarURL(member.avatarHash)} 
                      key={member.id} 
                      size={64}
                      onClick={e => {
                        this.onToggleCardAssignee(member.id)
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