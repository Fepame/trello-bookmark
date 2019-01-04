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
import Cover from "./components/Cover"
import AssigneeList from "./components/AssigneeList"
import LabelList from "./components/LabelList"
import Position from "./components/Position"
import List from "./components/List"
const { Panel } = Collapse
const { Item } = Form

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

        console.log(this.state.boards)
        // 5ba3f5c0a3adf352ead8d4dd - angie
        // 5c256228249174105c2ac3a1 - trello bookmark
        this.onBoardChange("5c256228249174105c2ac3a1")
        // console.log(boards.filter(board => board.id === this.state.currentBoardId)[0])
      })
  }

  onPaste = e => getImageSrc(e, imageSrc => this.setState({imageSrc}))

  onLinkChange = link => this.setState({link})

  onDescriptionChange = description => this.setState({description})
  
  onTitleChange = title => this.setState({title})
  
  onPositionChange = position => this.setState({position})
  
  onChangeDueTime = dueTime => this.setState({dueTime})
  
  onChangeDueDate = dueDate => this.setState({dueDate})

  onRemoveCover = () => this.setState({imageSrc: ''})
  
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
            <Form layout="vertical">
              <Row>
                <Col span={11}>
                  <Item>
                    <Title title={title} onTitleChange={this.onTitleChange} />
                  </Item>

                  <Item>
                    <Link link={link} onLinkChange={this.onLinkChange} />
                  </Item>

                  <Item>
                    <Cover imageSrc={imageSrc} onRemoveCover={this.onRemoveCover} />
                  </Item>
                </Col>
                <Col span={11} offset={2}>
                  <Item>
                    <Description
                      description={description}
                      onDescriptionChange={this.onDescriptionChange}
                    />
                  </Item>

                  <Item>
                    <LabelList
                      labels={labels}
                      selectedLabels={selectedLabels}
                      onLabelChange={this.onLabelChange}
                    />
                  </Item>

                  <Item>
                    <Row type="flex" justify="space-around">
                      <Col span={13}>
                        <DueDate
                          dueDate={dueDate}
                          onChangeDueDate={this.onChangeDueDate}
                        />
                      </Col>
                      <Col span={10} offset={1}>
                        <DueTime
                          dueDate={dueDate}
                          dueTime={dueTime}
                          onChangeDueTime={this.onChangeDueTime}
                        />
                      </Col>
                    </Row>
                  </Item>

                  {
                    boardMembers.length > 1 && <Item>
                      <AssigneeList
                        boardMembers={boardMembers}
                        cardAssignee={cardAssignee}
                        onToggleCardAssignee={this.onToggleCardAssignee}
                      />
                    </Item>}

                </Col>
              </Row>
              <Divider />
              <Row type="flex" justify="space-around">
                <Col span={24} style={{textAlign: 'right'}}>
                  <Button style={{marginRight: 10}}>Cancel</Button>
                  <Button type="primary" onClick={this.saveCard}>Save</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App