// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import notification from 'antd/lib/notification'
import { uiBrowseUpdateList, uiRevertDefinition, uiInfo, uiWarning } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import NotificationButtons from './Navigation/Ui/NotificationButtons'
import { getDefinitionsAction } from '../actions/definitionActions'
import { saveAs } from 'file-saver'
import { ROUTE_SHARE } from '../utils/routingConstants'
import { getCurationAction } from '../actions/curationActions'
import { saveGist } from '../api/github'
import base64js from 'base64-js'
import pako from 'pako'
import SystemManagedList from './SystemManagedList'

/**
 * Abstracts methods for user-managed list
 * Extends the method of a system-managed list, implementing and exposing all the methods used in any list that need an interaction by the user (import or modify data)
 */
export default class UserManagedList extends SystemManagedList {
  constructor(props) {
    super(props)
    this.state = {
      activeFilters: {},
      activeSort: null,
      sequence: 0,
      showFullDetail: false,
      path: null
    }
    this.onAddComponent = this.onAddComponent.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.loadComponentList = this.loadComponentList.bind(this)
    this.onRemoveAll = this.onRemoveAll.bind(this)
    this.showVersionSelectorPopup = this.showVersionSelectorPopup.bind(this)
    this.applySelectedVersions = this.applySelectedVersions.bind(this)
  }

  onRemoveComponent(component) {
    this.props.dispatch(this.updateList({ remove: component }))
  }

  onRemoveAll() {
    this.props.dispatch(this.updateList({ removeAll: {} }))
  }

  showVersionSelectorPopup(component, multiple) {
    this.setState({ showVersionSelectorPopup: true, multipleVersionSelection: multiple, selectedComponent: component })
  }

  applySelectedVersions(versions) {
    const { multipleVersionSelection, selectedComponent } = this.state
    if (!multipleVersionSelection) {
      return this.setState({ showVersionSelectorPopup: false }, async () => {
        if (selectedComponent.changes) {
          const key = `open${Date.now()}`
          notification.open({
            message: 'This definition has some changes. All the unsaved changes will be lost.',
            btn: (
              <NotificationButtons
                onClick={async () => {
                  await this.onRemoveComponent(selectedComponent)
                  await this.onAddComponent(
                    EntitySpec.fromCoordinates({ ...selectedComponent, revision: versions, changes: {} })
                  )
                  notification.close(key)
                }}
                onClose={() => notification.close(key)}
                confirmText="Ok"
                dismissText="Cancel"
              />
            ),
            key,
            onClose: notification.close(key),
            duration: 0
          })
        } else {
          await this.onRemoveComponent(selectedComponent)
          await this.onAddComponent(EntitySpec.fromCoordinates({ ...selectedComponent, revision: versions }))
        }
      })
    }
    this.setState({ showVersionSelectorPopup: false }, () =>
      versions.map(version =>
        this.onAddComponent(EntitySpec.fromCoordinates({ ...selectedComponent, revision: version }))
      )
    )
  }

  revertAll() {
    this.revert(null, 'Are you sure to revert all the unsaved changes from all the active definitions?')
  }

  revertDefinition(definition, value) {
    this.revert(definition, 'Are you sure to revert all the unsaved changes from the selected definition?', value)
  }

  revert(definition, description, value) {
    const { dispatch } = this.props
    if (value) {
      dispatch(uiRevertDefinition(definition, value))
      this.incrementSequence()
      return
    }
    const key = `open${Date.now()}`
    notification.open({
      message: 'Confirm Revert?',
      description,
      btn: (
        <NotificationButtons
          onClick={() => {
            dispatch(uiRevertDefinition(definition))
            this.incrementSequence()
            notification.close(key)
          }}
          onClose={() => notification.close(key)}
          confirmText="Revert"
          dismissText="Dismiss"
        />
      ),
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  doSave() {
    const { components } = this.props
    const spec = this.buildSaveSpec(components.list)
    this.saveSpec(spec)
    this.setState({ showSavePopup: false, fileName: null })
  }

  async saveSpec(spec) {
    const { dispatch } = this.props
    try {
      const fileObject = { filter: this.state.activeFilters, sortBy: this.state.activeSort, coordinates: spec }
      if (this.state.saveType === 'gist') await this.createGist(this.state.fileName, fileObject)
      else {
        const file = new File([JSON.stringify(fileObject, null, 2)], `${this.state.fileName}.json`)
        saveAs(file)
      }
    } catch (error) {
      if (error.status === 404)
        return uiWarning(dispatch, "Could not create Gist. Likely you've not given us permission")
      uiWarning(dispatch, error.message)
    }
  }

  async createGist(name, content) {
    const { token, dispatch } = this.props
    const url = await saveGist(token, `${name}.json`, JSON.stringify(content))
    const message = (
      <div>
        A new Gist File has been created and is available{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
          here
        </a>
      </div>
    )
    return uiInfo(dispatch, message)
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
    uiInfo(this.props.dispatch, message)
  }

  onAddComponent(value) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    if (!component.revision) return uiWarning(dispatch, `${path} needs version information`)

    !definitions.entries[path] &&
      dispatch(getDefinitionsAction(token, [path])) &&
      dispatch(getCurationAction(token, component))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  loadComponentList(content, name) {
    const list = this.getList(content)
    if (!list) return uiWarning(this.props.dispatch, `Invalid component list file: ${name}`)
    this.loadFromListSpec(list)
  }

  getList(content) {
    try {
      const object = typeof content === 'string' ? JSON.parse(content) : content
      if (this.isPackageLock(object)) return this.getListFromPackageLock(object.dependencies)
      if (this.isClearlyDefinedList(object)) return object
    } catch (error) {
      console.log(error)
    }
    return null
  }

  isPackageLock(content) {
    // TODO better, more definitive test here
    return !!content.dependencies
  }

  isClearlyDefinedList(content) {
    // TODO better, more definitive test here
    return !!content.coordinates
  }

  getListFromPackageLock(dependencies) {
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

  loadFromListSpec(list) {
    const { dispatch, definitions } = this.props
    if (list.filter) this.setState({ activeFilters: list.filter })
    if (list.sortBy) this.setState({ activeSort: list.sortBy })
    if (list.sortBy || list.filter) this.setState({ sequence: this.state.sequence + 1 })

    const toAdd = list.coordinates.map(component => EntitySpec.validateAndCreate(component)).filter(e => e)
    dispatch(uiBrowseUpdateList({ addAll: toAdd }))
    const missingDefinitions = toAdd.map(spec => spec.toPath()).filter(path => !definitions.entries[path])
    this.getDefinitionsAndNotify(missingDefinitions, 'All components have been loaded')
    dispatch(
      uiBrowseUpdateList({
        transform: this.createTransform.call(
          this,
          list.sortBy || this.state.activeSort,
          list.filter || this.state.activeFilters
        )
      })
    )
  }
}