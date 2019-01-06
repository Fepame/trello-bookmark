/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import moment from 'moment'
import { buildURL, getCurrentTab } from "./services/utils"
import { 
  getCardAssignee,
  uploadAttachment,
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
  Col
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
const { Item } = Form

const isExtension = window.location.protocol === 'chrome-extension:'
const closeWindow = () => isExtension && window.close()

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      boards: [],
      currentBoardId: undefined,
      lists: [],
      currentListId: undefined,
      title: '',
      position: 'top',
      description: '',
      link: '',
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

    isExtension && getCurrentTab(tab => this.setState({
      title: tab.title,
      link: tab.url
    }))

    fetch(buildURL('members/me/boards'))
      .then(response => response.json())
      .then(boards => {
        this.setState({
          boards: boards.filter(board => !board.closed && !board.idOrganization)
        })
        localStorage.lastBoardId && this.onBoardChange(localStorage.lastBoardId)
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
  
  onListChange = listId => {
    this.setState({currentListId: listId})
    localStorage.setItem(this.state.currentBoardId, listId)
  }

  clearState = callback => this.setState({
    lists: [],
    currentListId: undefined,
    labels: [],
    selectedLabels: [],
    boardMembers: [],
    cardAssignee: []
  }, callback)

  onToggleCardAssignee = memberId => this.setState({
    cardAssignee: getCardAssignee(this.state.cardAssignee, memberId)
  })

  onBoardChange = boardId => {
    this.clearState(() => {
      const { boards } = this.state
      this.setState({currentBoardId: boardId})
      localStorage.setItem("lastBoardId", boardId)
  
      boards
        .filter(board => board.id === boardId)
        .map(board => {
          fetchLists(board, lists => {
            const lastUsedListIdOnThisBoard = localStorage.getItem(boardId)
            let currentListId
            if(lastUsedListIdOnThisBoard 
              && lists.some(list => list.id === lastUsedListIdOnThisBoard)
            ){
              currentListId = lastUsedListIdOnThisBoard
            } else {
              currentListId = lists[0].id
              localStorage.setItem(boardId, currentListId)
            }
            this.setState({lists, currentListId})
          })
          
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
      const successMsg = () => {
        message.success("Card has been added")
        setTimeout(() => {
          closeWindow()
        }, 1000);
      }
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
          <Col span={22}>
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
                  <Button style={{marginRight: 10}} onClick={closeWindow}>Cancel</Button>
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