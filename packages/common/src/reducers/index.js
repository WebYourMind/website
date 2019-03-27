// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import sessionReducer from './sessionReducer'
import uiReducer from './uiReducer'
import definitionReducer from './definitionReducer'
import suggestionReducer from './suggestionReducer'
// import harvestReducer from './harvestReducer'

const rootReducer = combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  definition: definitionReducer,
  suggestion: suggestionReducer
  // harvest: harvestReducer
})

export default rootReducer
export { default as valueReducer } from './valueReducer'
export { default as listReducer } from './listReducer'
export { default as itemReducer } from './itemReducer'
export { default as tableReducer } from './tableReducer'
