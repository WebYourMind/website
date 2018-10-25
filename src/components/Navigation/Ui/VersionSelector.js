import React, { Component } from 'react'
import { Modal, FormGroup, Button } from 'react-bootstrap'
import { Select } from 'antd'
import { getRevisions } from '../../../api/clearlyDefined'
const Option = Select.Option
class VersionSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      selected: []
    }
  }
  async componentWillReceiveProps(nextProps) {
    const { component, token } = nextProps
    if (!component) return
    try {
      const options = await getRevisions(token, component.name, component.type)
      this.setState({ ...this.state, options })
    } catch (error) {
      console.log(error)
      this.setState({ ...this.state, options: [] })
    }
  }
  handleChange = value => {
    this.setState({ selected: value })
  }
  doSave = () => {
    const { onSave } = this.props
    const { selected } = this.state
    onSave(selected)
  }
  render() {
    const { multiple, show, onClose } = this.props
    const { options } = this.state
    const label = multiple
      ? `Pick one or move versions of the component to add to the definitions list`
      : `Pick a different version of the component`
    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <Select
              mode={multiple && 'multiple'}
              style={{ width: '100%' }}
              placeholder={label}
              onChange={this.handleChange}
            >
              {options.map(option => (
                <Option key={option}>{option}</Option>
              ))}
            </Select>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button onClick={onClose}>Cancel</Button>
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
