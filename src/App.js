/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import { buildURL, getAvatarURL, generateBlob } from "./services/trello";
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
import base64sample from "./services/base64";
const { TextArea } = Input
const { Option } = Select
const { Group } = Radio

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
      cardAssignee: [],
      imageSrc: ''
    }
  }
  
  componentDidMount = () => {
    document.onpaste = e => this.onPaste(e)

    fetch(buildURL('members/me/boards'))
      .then(response => response.json())
      .then(boards => {
        this.setState({
          boards: boards.filter(board => !board.closed && !board.idOrganization)
        })
        // 5ba3f5c0a3adf352ead8d4dd - angie
        // 5c0e5da5f0d45186648e19d5 - big short
        this.onBoardChange("5c0e5da5f0d45186648e19d5")
        console.log(boards.filter(board => board.id === this.state.currentBoardId)[0])
      })
  }

  onPaste = e => {
    const self = this
    const items = e.clipboardData.items;

    [...items].map(item => {
      if (item.kind === 'file') {
        const blob = item.getAsFile()
        const reader = new FileReader()
        reader.onload = e => {
          const imageSrc = e.target.result
          if(/base64/.test(imageSrc)) {
            self.setState({
              imageSrc: imageSrc
            })
          }
        }
        reader.readAsDataURL(blob)
      }
      return ""
    })
  }

  onLinkChange = link => this.setState({link})

  onDescriptionChange = description => this.setState({description})
  
  onTitleChange = title => this.setState({title})
  
  onPositionChange = position => this.setState({position})

  onListChange = listId => this.setState({currentListId: listId})

  clearState = callback => this.setState({
    boardMembers: [],
    lists: [],
    labels: [],
    selectedLabels: [],
    cardAssignee: []
  }, callback)

  onBoardChange = boardId => {
    this.clearState(() => {
      const { boards } = this.state
      this.setState({currentBoardId: boardId})
  
      boards
        .filter(board => board.id === boardId)
        .map(board => {
          fetch(buildURL(`boards/${board.id}/lists`))
            .then(response => response.json())
            .then(lists => this.setState({
              lists,
              currentListId: lists[0].id
            }))

          fetch(buildURL(`boards/${board.id}/labels`))
            .then(response => response.json())
            .then(labels => this.setState({labels}))

          return board.memberships.map(
            member => fetch(buildURL(`member/${member.idMember}`))
              .then(response => response.json())
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
      imageSrc,
      currentListId,
      selectedLabels,
      cardAssignee
    } = this.state

    fetch(
      buildURL(
        'cards',
        {
          name: title, 
          desc: description,
          pos: position,
          idLabels: selectedLabels.join(','),
          idMembers: cardAssignee.join(','),
          idList: currentListId
        }
      ),
      {
        method: 'POST'
      }
    )
    .then(response => response.json())
    .then(card => {
      const cardId = card.id
      const successMsg = message.success("Card has been added")
      if(imageSrc && link) {
        this.addAttachment(
          cardId,
          'LINK',
          this.addAttachment(
            cardId,
            'IMAGE',
            successMsg
          )
        )
      } else if (imageSrc) {
        this.addAttachment(cardId, 'IMAGE', successMsg)
      } else if (link) {
        this.addAttachment(cardId, 'LINK', successMsg)
      } else {
        successMsg()
      }
    })
  }

  addAttachment = (cardId, attachmentType, callback) => {
    const formData = new FormData()
    const { imageSrc, link } = this.state
    if (attachmentType === 'LINK') {
      formData.append("url", link)
    } else if (attachmentType === 'IMAGE') {
      formData.append(
        "file",
        generateBlob(imageSrc),
        "trello-capture-screenshot.jpg"
      )
    }
    
    fetch(
      buildURL(`cards/${cardId}/attachments`), {
        method: 'POST',
        body: formData
      }
    )
    .then(response => response.json())
    .then(callback)
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
      imageSrc,
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
                {
                  imageSrc
                  ? <img src={imageSrc} width={100} height={100} alt="preview" />
                  : <Icon type="eye" />
                }
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