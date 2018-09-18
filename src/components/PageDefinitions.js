// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import pako from 'pako'
import base64js from 'base64-js'
import { saveAs } from 'file-saver'
import notification from 'antd/lib/notification'
import AntdButton from 'antd/lib/button'
import { FilterBar } from './'
import { uiNavigation, uiBrowseUpdateList, uiNotificationNew } from '../actions/ui'
import { getDefinitionsAction } from '../actions/definitionActions'
import { ROUTE_DEFINITIONS, ROUTE_SHARE } from '../utils/routingConstants'
import EntitySpec from '../utils/entitySpec'

import AbstractPageDefinitions from './AbstractPageDefinitions'
import Definition from '../utils/definition'

class PageDefinitions extends AbstractPageDefinitions {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.doSave = this.doSave.bind(this)
    this.doSaveAsUrl = this.doSaveAsUrl.bind(this)
    this.revertAll = this.revertAll.bind(this)
    this.revertDefinition = this.revertDefinition.bind(this)
  }

  componentDidMount() {
    const { dispatch, path } = this.props
    if (path.length > 1) {
      try {
        const definitionSpec = pako.inflate(base64js.toByteArray(path), { to: 'string' })
        this.loadFromListSpec(JSON.parse(definitionSpec))
      } catch (e) {
        dispatch(uiNotificationNew({ type: 'warning', message: 'Loading components from URL failed', timeout: 5000 }))
      }
    }
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS }))
  }

  tableTitle() {
    return 'Available definitions'
  }

  renderSearchBar() {
    const { filterOptions } = this.props
    return (
      <Row className="show-grid spacer">
        <Col md={10} mdOffset={1}>
          <FilterBar options={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} clearOnChange />
        </Col>
      </Row>
    )
  }

  doRefreshAll = () => {
    if (this.hasChanges()) {
      const key = `open${Date.now()}`
      const NotificationButtons = (
        <Fragment>
          <AntdButton
            type="primary"
            size="small"
            onClick={() => {
              this.refresh()
              notification.close(key)
            }}
          >
            Refresh
          </AntdButton>{' '}
          <AntdButton type="secondary" size="small" onClick={() => notification.close(key)}>
            Dismiss
          </AntdButton>
        </Fragment>
      )
      notification.open({
        message: 'Unsaved Changes',
        description: 'Some information has been changed and is currently unsaved. Are you sure to continue?',
        btn: NotificationButtons,
        key,
        onClose: notification.close(key),
        duration: 0
      })
    } else {
      this.refresh()
    }
  }

  refresh = () => {
    const { components, dispatch, token } = this.props

    this.onRemoveAll()
    const definitions = this.buildSaveSpec(components.list)

    definitions.forEach(definition => {
      const path = definition.toPath()
      delete definition.changes
      dispatch(getDefinitionsAction(token, [path]))
    })

    dispatch(uiBrowseUpdateList({ addAll: definitions }))
    dispatch(uiNotificationNew({ type: 'info', message: 'All components have been refreshed', timeout: 3000 }))
  }

  revertAll() {
    this.revert(null, 'Are you sure to revert all the unsaved changes from all the active definitions?')
  }

  revertDefinition(definition) {
    this.revert(definition, 'Are you sure to revert all the unsaved changes from the selected definition?')
  }

  revert(definition, description, values) {
    const { components, dispatch } = this.props
    const key = `open${Date.now()}`
    const NotificationButtons = (
      <Fragment>
        <AntdButton
          type="primary"
          size="small"
          onClick={() => {
            Definition.revert(components.list, definition, values, dispatch)
            this.incrementSequence()
            notification.close(key)
          }}
        >
          Revert
        </AntdButton>{' '}
        <AntdButton type="secondary" size="small" onClick={() => notification.close(key)}>
          Dismiss
        </AntdButton>
      </Fragment>
    )
    notification.open({
      message: 'Unsaved Changes',
      description,
      btn: NotificationButtons,
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  renderButtons() {
    return (
      <div className="pull-right">
        <Button bsStyle="default" disabled={!this.hasChanges()} onClick={this.revertAll}>
          Revert All
        </Button>
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.doRefreshAll}>
          Refresh
        </Button>
        &nbsp;
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="danger" disabled={!this.hasComponents()} onClick={this.onRemoveAll}>
          Clear All
        </Button>
        &nbsp;
        {this.renderShareButton()}
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasChanges()} onClick={this.doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }

  renderShareButton() {
    const { components } = this.props
    const disabled = components.list.length === 0
    return (
      <DropdownButton disabled={disabled} id={'sharedropdown'} title="Share" bsStyle="success">
        <MenuItem eventKey="1" onSelect={this.doSaveAsUrl}>
          URL
        </MenuItem>
        <MenuItem eventKey="2" onSelect={this.doSave}>
          File
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled>Definitions (Not implemented)</MenuItem>
        <MenuItem disabled>SPDX (Not implemented)</MenuItem>
      </DropdownButton>
    )
  }

  updateList(o) {
    return uiBrowseUpdateList(o)
  }

  noRowsRenderer() {
    return <div className="list-noRows">Search for components above ...</div>
  }

  doSave() {
    const { components } = this.props
    const spec = this.buildSaveSpec(components.list)
    const fileObject = { filter: this.state.activeFilters, sortBy: this.state.activeSort, coordinates: spec }
    const file = new File([JSON.stringify(fileObject, null, 2)], 'components.json')
    saveAs(file)
  }

  doSaveAsUrl() {
    const { components } = this.props
    const spec = this.buildSaveSpec(components.list)
    const fileObject = { filter: this.state.activeFilters, sortBy: this.state.activeSort, coordinates: spec }
    const url = `${document.location.origin}${ROUTE_SHARE}/${base64js.fromByteArray(
      pako.deflate(JSON.stringify(fileObject))
    )}`
    this.copyToClipboard(url, 'URL copied to clipboard')
  }

  copyToClipboard(text, message) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    this.props.dispatch(uiNotificationNew({ type: 'info', message, timeout: 5000 }))
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const { dispatch } = this.props
    dispatch(uiNotificationNew({ type: 'info', message: 'Loading component list from file(s)', timeout: 5000 }))
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const listSpec = this.loadListSpec(reader.result, file)
        if (typeof listSpec === 'string') {
          const message = `Invalid component list file: ${listSpec}`
          return dispatch(uiNotificationNew({ type: 'info', message, timeout: 5000 }))
        }
        this.loadFromListSpec(listSpec)
      }
      reader.readAsBinaryString(file)
    })
  }

  onAddComponent(value, after = null) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    !definitions.entries[path] && dispatch(getDefinitionsAction(token, [path]))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  dropZone(child) {
    return (
      <Dropzone disableClick onDrop={this.onDrop} style={{ position: 'relative' }}>
        {child}
      </Dropzone>
    )
  }

  loadListSpec(content, file) {
    try {
      const object = JSON.parse(content)
      if (file.name.toLowerCase() === 'package-lock.json') return this.loadPackageLockFile(object.dependencies)
      if (object.coordinates) return object
      return 'No component coordinates found'
    } catch (e) {
      return e.message
    }
  }

  loadPackageLockFile(dependencies) {
    const coordinates = []
    for (const dependency in dependencies) {
      let [namespace, name] = dependency.split('/')
      if (!name) {
        name = namespace
        namespace = null
      }
      coordinates.push({ type: 'npm', provider: 'npmjs', namespace, name, revision: dependencies[dependency].version })
    }
    return { coordinates }
  }

  readOnly() {
    return false
  }

  async loadFromListSpec(listSpec) {
    const { dispatch, token, definitions } = this.props
    if (listSpec.filter) this.setState({ activeFilters: listSpec.filter })
    if (listSpec.sortBy) this.setState({ activeSort: listSpec.sortBy })
    if (listSpec.sortBy || listSpec.filter) this.setState({ sequence: this.state.sequence + 1 })

    const toAdd = listSpec.coordinates.map(component => EntitySpec.validateAndCreate(component)).filter(e => e)
    dispatch(uiBrowseUpdateList({ addAll: toAdd }))
    const missingDefinitions = toAdd.map(spec => spec.toPath()).filter(path => !definitions.entries[path])
    await dispatch(getDefinitionsAction(token, missingDefinitions))
    dispatch(
      uiBrowseUpdateList({
        transform: this.createTransform.call(
          this,
          listSpec.sortBy || this.state.activeSort,
          listSpec.filter || this.state.activeFilters
        )
      })
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    filterValue: state.ui.browse.filter,
    path: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    filterOptions: state.ui.browse.filterList,
    components: state.ui.browse.componentList,
    definitions: state.definition.bodies
  }
}
export default connect(mapStateToProps)(PageDefinitions)
