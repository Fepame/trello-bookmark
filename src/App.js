import React, { Component } from 'react'
import { Input, Select, Button, Radio, Form } from 'antd'
const { TextArea } = Input
const { Option } = Select
const { Group } = Radio

class App extends Component {
  render() {
    return (
      <div className="App">
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item>
            <TextArea placeholder="Card title" autosize={{ minRows: 1 }} />
          </Form.Item>
          
          <Form.Item>
            <TextArea placeholder="Card description" autosize={{ minRows: 1 }} />
          </Form.Item>

          <Form.Item>
            <Select defaultValue="lucy">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Board 2</Option>
              <Option value="disabled" disabled>Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Select defaultValue="lucy">
              <Option value="jack">Jack</Option>
              <Option value="lucy">List 2</Option>
              <Option value="disabled" disabled>Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Group defaultValue="a" buttonStyle="solid">
              <Radio.Button value="a">Top</Radio.Button>
              <Radio.Button value="b">Bottom</Radio.Button>
            </Group>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default App