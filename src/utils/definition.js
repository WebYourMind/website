import Contribution from './contribution'
import EntitySpec from './entitySpec'
import { get } from 'lodash'
import { uiBrowseUpdateList } from '../actions/ui'

// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Abstract methods for Definition
export default class Definition {
  static getPathFromUrl(props) {
    return props.path ? props.path : props.location ? props.location.pathname.slice(props.match.url.length + 1) : null
  }

  static getDefinitionPreview(state) {
    return !state.ui.curate.previewDefinition.isFetching
      ? Contribution.getChangesFromPreview(
          Object.assign({}, state.ui.inspect.definition.item),
          Object.assign({}, state.ui.curate.previewDefinition.item)
        )
      : {}
  }

  static getDefinitionEntity(path) {
    return path ? EntitySpec.fromPath(path) : null
  }

  static computeScores(definition) {
    if (!get(definition, 'described')) return null
    const tool = Math.ceil((get(definition, 'described.toolScore', 0) + get(definition, 'licensed.toolScore', 0)) / 2)
    const effective = Math.ceil((get(definition, 'described.score', 0) + get(definition, 'licensed.score', 0)) / 2)
    return { tool, effective }
  }

  /**
   * Revert a list of definitions or a specific one, removing all the changes or only specific values
   * @param  {[]} components list of definitions
   * @param  {string} definition specific definition, if null the function will check all the definitions
   * @param  {{}} data object containing the specific values to revert, if null all the changes will be removed
   */
  static revert(components, definition, data, dispatch) {
    if (!components) return
    const componentsWithoutChanges = components.map(component => {
      const { changes, ...withoutChanges } = component
      return withoutChanges
    })
    dispatch(uiBrowseUpdateList({ updateAll: componentsWithoutChanges }))
  }
}
