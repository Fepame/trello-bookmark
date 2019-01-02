/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import { buildURL, generateBlob } from "./services/trello"
import {
  message,
  Button,
  Form,
  Row,
  Col,
  Icon
} from 'antd'
import Title from "./components/Title"
import Description from "./components/Description"
import Link from "./components/Link"
import Board from "./components/Board"
import Avatar from "./components/Avatar"
import Tag from "./components/Tag"
import Position from "./components/Position"
import List from "./components/List"

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
        // console.log(boards.filter(board => board.id === this.state.currentBoardId)[0])
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
                <Title title={title} onTitleChange={this.onTitleChange} />
              </Form.Item>

              <Form.Item>
                <Link link={link} onLinkChange={this.onLinkChange} />                
              </Form.Item>

              <Form.Item>
                <Description
                  title={description}
                  onDescriptionChange={this.onDescriptionChange}
                />
              </Form.Item>

              <Form.Item>
                <Board
                  currentBoardId={currentBoardId}
                  onBoardChange={this.onBoardChange}
                  boards={boards}
                />
              </Form.Item>

              <Form.Item>
                <List
                  currentListId={currentListId}
                  onListChange={this.onListChange}
                  lists={lists}
                />
              </Form.Item>

              <Form.Item>
                <Position
                  position={position}
                  onPositionChange={this.onPositionChange}
                />
              </Form.Item>

              <Form.Item>
                <Tag
                  labels={labels}
                  selectedLabels={selectedLabels}
                  onLabelChange={this.onLabelChange}
                />
              </Form.Item>

              <Form.Item>
                <Avatar
                  boardMembers={boardMembers}
                  cardAssignee={cardAssignee}
                  onToggleCardAssignee={this.onToggleCardAssignee}
                />
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