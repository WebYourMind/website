// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { url } from '../api/clearlyDefined'

/**
 * Open the service's auth page and execute a callback with the returned data from the server
 */
export function doLogin(callback) {
  window.open(url('auth/github'))
  const tokenListener = e => {
    if (e.data.type === 'github-token') {
      callback(e.data.token, e.data.permissions, e.data.username)
      window.removeEventListener('message', tokenListener)
    }
  }
  window.addEventListener('message', tokenListener)
}
