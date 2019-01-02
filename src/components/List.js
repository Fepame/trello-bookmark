import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
const { Option } = Select

const List = ({ currentListId, onListChange, lists }) => (
  <Select 
    value={currentListId}
    onChange={onListChange}
    placeholder="Select a list"
  >
    {lists.map(
      list => 
        <Option value={list.id} key={list.id}>{list.name}</Option>
    )}
  </Select>
)

List.propTypes = {
  currentBoardId: PropTypes.string.isRequired,
  onListChange: PropTypes.func.isRequired,
  lists: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default List
