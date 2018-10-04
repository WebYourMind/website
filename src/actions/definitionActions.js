// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getDefinitions, getDefinition, previewDefinition, getDefinitionSuggestions } from '../api/clearlyDefined'
import Definition from '../utils/definition'
import { uiBrowseUpdateList } from './ui'

export const DEFINITION_LIST = 'DEFINITION_LIST'
export const DEFINITION_BODIES = 'DEFINITION_BODIES'

export function getDefinitionAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getDefinition(token, entity, { expandPrs: true }).then(
      result =>
        dispatch(
          actions.success({
            described: {
              sourceLocation: {
                type: 'git',
                provider: 'github',
                url: 'https://github.com/caolan/async/commit/ba6ed320e350f8b2eae4eb9683302ddac0ddf66f',
                revision: 'ba6ed320e350f8b2eae4eb9683302ddac0ddf66f',
                namespace: 'caolan',
                name: 'async'
              },
              releaseDate: '2017-11-16',
              projectWebsite: 'https://caolan.github.io/async/',
              issueTracker: 'https://github.com/caolan/async/issues',
              tools: ['scancode/2.9.0+b1', 'clearlydefined/1', 'curation/63b2dde4188849a660de4ebe44f301f34c2e7886'],
              toolScore: 2,
              score: 2
            },
            licensed: {
              declared: 'Apache-2.0',
              toolScore: 2,
              facets: {
                core: {
                  attribution: { unknown: 2, parties: ['Copyright (c) 2010-2017 Caolan McMahon'] },
                  discovered: { unknown: 1, expressions: ['MIT'] },
                  files: 3
                }
              },
              score: 2
            },
            files: [
              { path: 'package/bower.json' },
              { path: 'package/LICENSE', license: 'MIT', attributions: ['Copyright (c) 2010-2017 Caolan McMahon'] },
              { path: 'package/package.json', license: 'MIT' }
            ],
            coordinates: { type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.0' },
            _meta: {
              schema: '1.1.0',
              pending: [
                {
                  number: 23,
                  title: 'some more cool changes',
                  contributor: 'jeffmcaffer'
                }
              ],
              merged: [
                {
                  number: 3,
                  title: 'some cool changes',
                  contributor: 'jeffmcaffer',
                  curator: 'willbar'
                },
                {
                  number: 63,
                  title: 'some cool changes',
                  contributor: 'jeffmcaffer',
                  curator: 'willbar'
                }
              ]
            }
          })
        ),
      error => dispatch(actions.error(error))
    )
  }
}

export function getDefinitionsAction(token, entities) {
  return dispatch => {
    const actions = asyncActions(DEFINITION_BODIES)
    dispatch(actions.start())
    return getDefinitions(token, entities).then(
      result => dispatch(actions.success({ add: result })),
      error => dispatch(actions.error(error))
    )
  }
}

export function getDefinitionSuggestionsAction(token, prefix, name) {
  return dispatch => {
    if (!prefix) return null
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getDefinitionSuggestions(token, prefix).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function previewDefinitionAction(token, entity, curation, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return previewDefinition(token, entity, curation).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function resetPreviewDefinitionAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return dispatch(actions.success({}))
  }
}

export function revertDefinitionAction(definition, values, name) {
  return (dispatch, getState) => {
    const state = getState()
    const actions = asyncActions(name)
    dispatch(actions.start({ definition, values }))
    const componentsWithoutChanges = Definition.revert(state.ui.browse.componentList.list, definition, values)
    dispatch(uiBrowseUpdateList({ updateAll: componentsWithoutChanges }))
    return dispatch(actions.success({ componentsWithoutChanges }))
  }
}
