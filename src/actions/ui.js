// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { getCurationAction, getCurationListAction, getCurationDataAction } from './curationActions'
import {
  getDefinitionAction,
  previewDefinitionAction,
  getDefinitionSuggestionsAction,
  resetPreviewDefinitionAction,
  revertAction,
  browseDefinitionsAction
} from './definitionActions'
import { getHarvestOutputAction } from './harvestActions'
import { getPrDataAction } from './prActions'

export const UI_NAVIGATION = 'UI_NAVIGATION'
export const UI_REDIRECT = 'UI_REDIRECT'

export const UI_NOTIFICATION_NEW = 'UI_NOTIFICATION_NEW'
export const UI_NOTIFICATION_DELETE = 'UI_NOTIFICATION_DELETE'

export const UI_INSPECT_UPDATE_FILTER = 'UI_INSPECT_UPDATE_FILTER'
export const UI_INSPECT_GET_CURATIONS = 'UI_INSPECT_GET_CURATIONS'
export const UI_INSPECT_GET_DEFINITION = 'UI_INSPECT_GET_DEFINITION'
export const UI_INSPECT_GET_HARVESTED = 'UI_INSPECT_GET_HARVESTED'

export const UI_GET_CURATION_DATA = 'UI_GET_CURATION_DATA'
export const UI_GET_CURATIONS_LIST = 'UI_GET_CURATIONS_LIST'

export const UI_CONTRIBUTION_GET_URL = 'UI_CONTRIBUTION_GET_URL'
export const UI_CONTRIBUTION_UPDATE_LIST = 'UI_CONTRIBUTION_UPDATE_LIST'
export const UI_CONTRIBUTION_DEFINITIONS = 'UI_CONTRIBUTION_DEFINITIONS'
export const UI_CONTRIBUTION_APPLY_SUGGESTION = 'UI_CONTRIBUTION_APPLY_SUGGESTION'

export const UI_CURATE_UPDATE_FILTER = 'UI_CURATE_UPDATE_FILTER'
export const UI_CURATE_UPDATE_FILTER_LIST = 'UI_CURATE_UPDATE_FILTER_LIST'
export const UI_CURATE_GET = 'UI_CURATE_GET'
export const UI_CURATE_GET_PROPOSED = 'UI_CURATE_GET_PROPOSED'
export const UI_CURATE_GET_DEFINITION = 'UI_CURATE_GET_DEFINITION'
export const UI_CURATE_GET_DEFINITION_PROPOSED = 'UI_CURATE_GET_DEFINITION_PROPOSED'
export const UI_CURATE_DEFINITION_PREVIEW = 'UI_CURATE_DEFINITION_PREVIEW'
export const UI_DEFINITION_REVERT = 'UI_DEFINITION_REVERT'

export const UI_DEFINITIONS_UPDATE_FILTER = 'UI_DEFINITIONS_UPDATE_FILTER'
export const UI_DEFINITIONS_UPDATE_FILTER_LIST = 'UI_DEFINITIONS_UPDATE_FILTER_LIST'
export const UI_DEFINITIONS_UPDATE_LIST = 'UI_DEFINITIONS_UPDATE_LIST'

export const UI_BROWSE_UPDATE_FILTER = 'UI_BROWSE_UPDATE_FILTER'
export const UI_BROWSE_UPDATE_FILTER_LIST = 'UI_BROWSE_UPDATE_FILTER_LIST'
export const UI_BROWSE_UPDATE_LIST = 'UI_BROWSE_UPDATE_LIST'
export const UI_BROWSE_REVERT = 'UI_BROWSE_REVERT'

export const UI_HARVEST_UPDATE_FILTER = 'UI_HARVEST_UPDATE_FILTER'
export const UI_HARVEST_UPDATE_QUEUE = 'UI_HARVEST_UPDATE_QUEUE'

export function uiNavigation(navItem) {
  return { type: UI_NAVIGATION, to: navItem }
}

export function uiRedirect(to) {
  return { type: UI_REDIRECT, to }
}

let nextNotificationId = 0

export function uiInfo(dispatch, message, timeout = 5000) {
  dispatch(uiNotificationNew({ type: 'info', message, timeout }))
}

export function uiWarning(dispatch, message, timeout = 5000) {
  dispatch(uiNotificationNew({ type: 'warning', message, timeout }))
}

export function uiDanger(dispatch, message, timeout = 5000) {
  dispatch(uiNotificationNew({ type: 'danger', message, timeout }))
}

export function uiNotificationNew(message) {
  return { type: UI_NOTIFICATION_NEW, message: { ...message, id: nextNotificationId++ } }
}

export function uiNotificationDelete(message) {
  return { type: UI_NOTIFICATION_DELETE, message }
}

export function uiInspectGetCurations(token, entity) {
  return getCurationAction(token, entity, UI_INSPECT_GET_CURATIONS)
}

export function uiInspectGetDefinition(token, entity) {
  return getDefinitionAction(token, entity, UI_INSPECT_GET_DEFINITION)
}

export function uiInspectGetHarvested(token, entity) {
  return getHarvestOutputAction(token, entity, UI_INSPECT_GET_HARVESTED)
}

export function uiContributionGetData(token, entity) {
  return getPrDataAction(token, entity)
}

// Get the curation in the given PR relative to the specified coordinates
export function uiGetCurationData(token, entity, prNumber) {
  return getCurationDataAction(token, entity, UI_GET_CURATION_DATA, prNumber)
}

export function uiApplyCurationSuggestion(value) {
  return { type: UI_CONTRIBUTION_APPLY_SUGGESTION, result: value }
}

export function uiContributionUpdateList(value) {
  return { type: UI_CONTRIBUTION_UPDATE_LIST, result: value }
}

export function uiContributionDefinitions(value) {
  return { type: UI_CONTRIBUTION_DEFINITIONS, result: value }
}

export function uiCurateUpdateFilter(value) {
  return { type: UI_CURATE_UPDATE_FILTER, value }
}

export function uiCurateUpdateFilterList(token, prefix) {
  return getDefinitionSuggestionsAction(token, prefix, UI_CURATE_UPDATE_FILTER_LIST)
}

export function uiCurateGetCuration(token, entity) {
  return getCurationAction(token, entity, entity.pr ? UI_CURATE_GET_PROPOSED : UI_CURATE_GET)
}

export function uiGetCurationsList(token, entity, params) {
  return getCurationListAction(token, entity, UI_GET_CURATIONS_LIST, params)
}

export function uiCurateGetDefinition(token, entity) {
  return getDefinitionAction(token, entity, entity.pr ? UI_CURATE_GET_DEFINITION_PROPOSED : UI_CURATE_GET_DEFINITION)
}

export function uiCurateGetDefinitionPreview(token, entity, curation) {
  return previewDefinitionAction(token, entity, curation, UI_CURATE_DEFINITION_PREVIEW)
}

export function uiCurateResetDefinitionPreview(token, entity) {
  return resetPreviewDefinitionAction(token, entity, UI_CURATE_DEFINITION_PREVIEW)
}

export function uiRevert(definition, values, store) {
  return revertAction(definition, values, store === 'browse' ? UI_BROWSE_REVERT : UI_DEFINITION_REVERT)
}

export function uiBrowseGet(token, query) {
  return browseDefinitionsAction(token, query, UI_BROWSE_UPDATE_LIST)
}

export function uiBrowseUpdateFilter(value) {
  return { type: UI_DEFINITIONS_UPDATE_FILTER, value }
}

export function uiBrowseUpdateFilterList(token, prefix) {
  return getDefinitionSuggestionsAction(token, prefix, UI_DEFINITIONS_UPDATE_FILTER_LIST)
}

export function uiDefinitionsUpdateList(value) {
  return { type: UI_DEFINITIONS_UPDATE_LIST, result: value }
}

export function uiBrowseUpdateList(value) {
  return { type: UI_BROWSE_UPDATE_LIST, result: value }
}

export function uiHarvestUpdateFilter(value) {
  return { type: UI_HARVEST_UPDATE_FILTER, value }
}

export function uiHarvestUpdateQueue(value) {
  return { type: UI_HARVEST_UPDATE_QUEUE, result: value }
}
