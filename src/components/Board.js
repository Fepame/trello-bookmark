import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
const { Option, OptGroup } = Select

const generateList = (teams, boards) => teams.map(
  team => <OptGroup label={team.displayName} key={team.displayName}>
    {boards.filter(board => board.idOrganization === team.id).map(
      board => <Option value={board.id} key={board.id}>{board.name}</Option>
    )}
  </OptGroup>
)

const Board = ({ currentBoardId, onBoardChange, boards, teams }) => (
  <Select 
    showSearch
    optionFilterProp="children"
    value={currentBoardId}
    onChange={onBoardChange}
    placeholder="Select a board"
    style={{width: '100%'}}
  >
    {generateList(teams, boards)}
  </Select>
)

Board.propTypes = {
  currentBoardId: PropTypes.string,
  teams: PropTypes.arrayOf(PropTypes.object),
  onBoardChange: PropTypes.func.isRequired,
  boards: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Board
