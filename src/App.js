/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import moment from 'moment'
import { buildURL } from "./services/utils"
import { 
  getCardAssignee,
  uploadAttachment,
  getSelectedLabels,
  getImageSrc,
  fetchLabels,
  fetchLists,
  fetchMember
} from './services/methods'
import {
  message,
  Button,
  Form,
  Row,
  Divider,
  Collapse,
  Col,
  Icon
} from 'antd'
import Title from "./components/Title"
import Description from "./components/Description"
import Link from "./components/Link"
import DueTime from "./components/DueTime"
import DueDate from "./components/DueDate"
import Board from "./components/Board"
import Avatar from "./components/Avatar"
import Label from "./components/Label"
import Position from "./components/Position"
import List from "./components/List"
const { Panel } = Collapse

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
      imageSrc: '',
      dueDate: null,
      dueTime: '12:00'
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

  onPaste = e => getImageSrc(e, imageSrc => this.setState({imageSrc: imageSrc}))

  onLinkChange = link => this.setState({link})

  onDescriptionChange = description => this.setState({description})
  
  onTitleChange = title => this.setState({title})
  
  onPositionChange = position => this.setState({position})
  
  onChangeDueTime = dueTime => this.setState({dueTime})
  
  onChangeDueDate = dueDate => this.setState({dueDate})
  
  onListChange = listId => this.setState({currentListId: listId})

  clearState = callback => this.setState({
    boardMembers: [],
    lists: [],
    labels: [],
    selectedLabels: [],
    cardAssignee: []
  }, callback)

  onToggleCardAssignee = memberId => this.setState({
    cardAssignee: getCardAssignee(this.state.cardAssignee, memberId)
  })

  onBoardChange = boardId => {
    this.clearState(() => {
      const { boards } = this.state
      this.setState({currentBoardId: boardId})
  
      boards
        .filter(board => board.id === boardId)
        .map(board => {
          fetchLists(board, lists => this.setState({
            lists, currentListId: lists[0].id
          }))
          
          fetchLabels(board, labels => this.setState({labels}))

          return board.memberships.map(
            member => fetchMember(member, boardMember => this.setState({
              boardMembers: [...this.state.boardMembers, boardMember]
            }))
          )
        })
    })
  }
  
  onLabelChange = selectedLabels => this.setState({selectedLabels})

  saveCard = () => {
    const { 
      title,
      description,
      position,
      link,
      imageSrc,
      dueDate,
      dueTime,
      currentListId,
      selectedLabels,
      cardAssignee
    } = this.state

    const dueDateAndTime = dueDate 
      && moment(`${dueDate} ${dueTime}`, "DD.MM.YYYY HH:mm").toISOString()

    fetch(
      buildURL(
        'cards',
        {
          name: title, 
          desc: description,
          pos: position,
          due: dueDateAndTime,
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

  filledBackground = filled => filled ? '#f6fbff' : 'none'

  addAttachment = (cardId, attachmentType, callback) => {
    const { imageSrc, link } = this.state
    uploadAttachment(cardId, attachmentType, imageSrc, link, callback)
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
      cardAssignee,
      dueTime,
      dueDate
    } = this.state

    return (
      <div className="App">
        <Row type="flex" justify="space-around">
          <Col span={11}>
            <Divider>Card location</Divider>
            <Row>
              <Col span={7} offset={1}>
                <Board
                  currentBoardId={currentBoardId}
                  onBoardChange={this.onBoardChange}
                  boards={boards}
                />
              </Col>
              <Col span={7} offset={1}>
                <List
                  currentListId={currentListId}
                  onListChange={this.onListChange}
                  lists={lists}
                />
              </Col>
              <Col span={7} offset={1}>
                <Position
                  position={position}
                  onPositionChange={this.onPositionChange}
                />
              </Col>
            </Row>

            <Divider>Card details</Divider>

            <Row>
              <Col span={11}>
                <Collapse bordered={false} defaultActiveKey={[
                  'title', 'description', 'cover'
                ]}>
                  <Panel header="Title" key="title" forceRender style={{
                    background: this.filledBackground(title)
                  }}>
                    <Title title={title} onTitleChange={this.onTitleChange} />
                  </Panel>

                  <Panel header="Description" key="description" forceRender style={{
                    background: this.filledBackground(description)
                  }}>
                    <Description
                      description={description}
                      onDescriptionChange={this.onDescriptionChange}
                    />
                  </Panel>

                  <Panel header="Cover" key="cover" forceRender style={{
                    background: this.filledBackground(imageSrc)
                  }}>
                    {
                      imageSrc
                      ? <img src={imageSrc} width={100} height={100} alt="preview" />
                      : <Icon type="eye" />
                    }
                  </Panel>
                </Collapse>
              </Col>
              <Col span={11} offset={2}>
                <Collapse bordered={false} defaultActiveKey={[
                  'link', 'labels', 'assignee', 'dueDateAndTime'
                ]}>
                  <Panel header="Link" key="link" forceRender style={{
                    background: this.filledBackground(link)
                  }}>
                    <Link link={link} onLinkChange={this.onLinkChange} />
                  </Panel>

                  <Panel header="Labels" key="labels" forceRender style={{
                    background: this.filledBackground(selectedLabels.length)
                  }}>
                    <Label
                      labels={labels}
                      selectedLabels={selectedLabels}
                      onLabelChange={this.onLabelChange}
                    />
                  </Panel>

                  <Panel header="Assignee" key="assignee" forceRender style={{
                    background: this.filledBackground(cardAssignee.length)
                  }}>
                    <Avatar
                      boardMembers={boardMembers}
                      cardAssignee={cardAssignee}
                      onToggleCardAssignee={this.onToggleCardAssignee}
                    />
                  </Panel>

                  <Panel header="Due date" key="dueDateAndTime" forceRender style={{
                    background: this.filledBackground(dueDate && dueTime)
                  }}>
                    <Row type="flex" justify="space-around">
                      <Col span={13}>
                        <DueDate
                          dueDate={dueDate}
                          onChangeDueDate={this.onChangeDueDate}
                        />
                      </Col>
                      <Col span={9}>
                        <DueTime
                          dueDate={dueDate}
                          dueTime={dueTime}
                          onChangeDueTime={this.onChangeDueTime}
                        />
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
            <Button type="primary" onClick={this.saveCard}>Save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App