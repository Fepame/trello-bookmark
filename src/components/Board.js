import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
const { Option } = Select

const Board = ({ currentBoardId, onBoardChange, boards }) => (
  <Select 
    value={currentBoardId}
    onChange={onBoardChange}
    placeholder="Select a board"
    style={{width: '100%'}}
  >
    {boards.map(
      board => 
        <Option value={board.id} key={board.id}>{board.name}</Option>
    )}
  </Select>
)

Board.propTypes = {
  currentBoardId: PropTypes.string,
  onBoardChange: PropTypes.func.isRequired,
  boards: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Board
