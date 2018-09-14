// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button } from 'react-bootstrap'
import { FieldGroup } from './'

export default class ContributePrompt extends Component {
  constructor(props) {
    super(props)
    this.state = { show: false, summary: '', details: '', supportingInfo: '', type: 'select' }
    this.canSubmit = this.canSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
    this.close = this.close.bind(this)
  }

  static propTypes = {
    actionHandler: PropTypes.func.isRequired
  }

  static defaultProps = {}

  open() {
    this.setState({ show: true, summary: '', details: '', supportingInfo: '', type: 'select' })
  }

  close() {
    this.setState({ show: false })
  }

  okHandler(e) {
    this.close()
    const { show, ...constributionInfo } = this.state
    this.props.actionHandler(constributionInfo)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  canSubmit() {
    const { details, supportingInfo, summary, type } = this.state

    return summary.length > 10 && type !== 'select' && details.length > 10 && supportingInfo.length > 10
  }

  render() {
    const { details, supportingInfo, summary, show, type, resolution } = this.state
    return (
      <Modal show={show} onHide={this.close}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Describe the changes in this curation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FieldGroup
              name="summary"
              type="text"
              label="Summary"
              value={summary || ''}
              onChange={this.handleChange}
              placeholder="Short summary of changes. Like a commit message..."
              maxLength={100}
              componentClass="textarea"
              rows="2"
              required
            />
            <FieldGroup
              name="type"
              label="Type"
              value={type || 'select'}
              onChange={this.handleChange}
              placeholder="select"
              componentClass="select"
              required
            >
              <option value="select" disabled>
                select
              </option>
              <option value="missing">Missing</option>
              <option value="incorrect">Incorrect</option>
              <option value="incomplete">Incomplete</option>
              <option value="ambiguous">Ambiguous</option>
              <option value="other">Other</option>
            </FieldGroup>
            <FieldGroup
              name="details"
              type="text"
              label="Details"
              value={details || ''}
              onChange={this.handleChange}
              placeholder="Describe here the problem(s) being addressed"
              maxLength={300}
              componentClass="textarea"
              rows="3"
              required
            />
            <FieldGroup
              name="supportingInfo"
              type="text"
              label="Supporting Info"
              value={supportingInfo || ''}
              onChange={this.handleChange}
              placeholder="References to docs where the new data was found, pointer to public conversations with the affected project team"
              maxLength={300}
              componentClass="textarea"
              rows="3"
              required
            />
            <FieldGroup
              name="resolution"
              type="text"
              label="Resolution"
              value={resolution || ''}
              onChange={this.handleChange}
              placeholder="What does this PR do to address the issue"
              maxLength={300}
              componentClass="textarea"
              rows="3"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Cancel</Button>
            <Button bsStyle="success" disabled={!this.canSubmit()} type="button" onClick={this.okHandler}>
              OK
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
