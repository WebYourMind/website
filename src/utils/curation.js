// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { difference } from './utils'

/**
 * Abstract methods for Curation
 *
 */
export default class Curation {
  static getSuggestions(latestCuration, currentCuration) {
    if (!latestCuration || !currentCuration) return
    return difference(latestCuration, currentCuration)
  }
}
