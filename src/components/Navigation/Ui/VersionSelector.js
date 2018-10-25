import React, { Component } from 'react'
import { Modal, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import { Select } from 'antd'
const Option = Select.Option
const children = []
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}
class VersionSelector extends Component {
  handleChange = value => {
    console.log(`selected ${value}`)
  }
  render() {
    const { multiple, show } = this.props
    const label = multiple
      ? `Pick one or move versions of the component to add to the definitions list`
      : `Pick a different version of the component`
    return (
      <Modal show={show} onHide={() => this.setState({ showSavePopup: false })}>
        <Modal.Header closeButton>
          <Modal.Title>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <Select
              mode={multiple && 'multiple'}
              style={{ width: '100%' }}
              placeholder={label}
              defaultValue={['a10', 'c12']}
              onChange={this.handleChange}
            >
              {children}
            </Select>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button onClick={() => this.setState({ showSavePopup: false })}>Cancel</Button>
              <Button bsStyle="success" type="button" onClick={() => this.doSave()}>
                OK
              </Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default VersionSelector
