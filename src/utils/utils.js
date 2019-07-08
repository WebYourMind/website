// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import deepDiff from 'deep-diff'

const { set } = require('lodash')

function setIfValue(target, path, value) {
  if (!value) return
  if (Array.isArray(value) && value.length === 0) return
  set(target, path, value)
}

function difference(object, base) {
  const changes = deepDiff.diff(base, object)
  if (!changes || changes.length === 0) return {}
  const newValue = {}
  changes.forEach(change => deepDiff.applyChange(newValue, change, change))
  return newValue
}

function asObject(item) {
  if (typeof item !== 'string') return item
  try {
    return JSON.parse(item)
  } catch (e) {
    return undefined
  }
}

// Function that return a URL string from an object
function getParamsToUrl(data) {
  let params = new URLSearchParams()
  for (let key in data) {
    if (data.hasOwnProperty(key) && data[key]) params.set(key, data[key])
  }
  return params.toString()
}

function getParamsFromUrl(search) {
  const params = new URLSearchParams(search)
  if (params.toString() === '') return
  return paramsToObject(params.entries())
}

function paramsToObject(entries) {
  let result = {}
  for (let entry of entries) {
    const [key, value] = entry
    result[key] = value
  }
  return result
}

const customLicenseIds = ['NONE', 'OTHER']

const sorts = [
  { value: 'license', label: 'License' },
  { value: 'name', label: 'Name' },
  { value: 'namespace', label: 'Namespace' },
  { value: 'provider', label: 'Provider' },
  { value: 'releaseDate', label: 'Release Date' },
  { value: 'score', label: 'Score' },
  { value: 'type', label: 'Type' }
]

const licenses = [
  { value: 'Apache-2.0', label: 'Apache-2.0' },
  { value: 'Artistic-2.0', label: 'Artistic-2.0' },
  { value: 'BSD-2-Clause', label: 'BSD-2-Clause' },
  { value: 'BSD-3-Clause', label: 'BSD-3-Clause' },
  { value: 'CC-BY-4.0', label: 'CC-BY-4.0' },
  { value: 'CC0-1.0', label: 'CC0-1.0' },
  { value: 'EPL-1.0', label: 'EPL-1.0' },
  { value: 'GPL-2.0', label: 'GPL-2.0' },
  { value: 'GPL-3.0', label: 'GPL-3.0' },
  { value: 'ISC', label: 'ISC' },
  { value: 'LGPL-2.1', label: 'LGPL-2.1' },
  { value: 'LGPL-3.0', label: 'LGPL-3.0' },
  { value: 'MIT', label: 'MIT' },
  { value: 'MPL-2.0', label: 'MPL-2.0' },
  { value: 'MS-PL', label: 'MS-PL' },
  { value: 'Zlib', label: 'Zlib' },
  { value: 'presence', label: 'Presence Of' },
  { value: 'absence', label: 'Absence Of' }
]

const sources = [{ value: 'PRESENCE OF', label: 'Presence Of' }, { value: 'ABSENCE OF', label: 'Absence Of' }]

const releaseDates = [{ value: 'PRESENCE OF', label: 'Presence Of' }, { value: 'ABSENCE OF', label: 'Absence Of' }]
const changes = [{ value: 'PRESENCE OF', label: 'Presence Of' }, { value: 'ABSENCE OF', label: 'Absence Of' }]

const curateFilters = [
  { value: 'effective', label: 'Focus on overall issues' },
  { value: 'licensed', label: 'Focus on license issues' },
  { value: 'described', label: 'Focus on description issues' }
]

const types = [
  { value: 'pod', label: 'Pod', provider: 'cocoapods' },
  { value: 'crate', label: 'Crate', provider: 'cratesio' },
  { value: 'git', label: 'Git', provider: 'github' },
  { value: 'maven', label: 'Maven', provider: 'mavencentral' },
  { value: 'npm', label: 'Npm', provider: 'npmjs' },
  { value: 'nuget', label: 'NuGet', provider: 'nuget' },
  { value: 'pypi', label: 'PyPi', provider: 'pypi' },
  { value: 'gem', label: 'Gem', provider: 'rubygems' },
  { value: 'sourcearchive', label: 'SourceArchive' }
]

const providers = [
  { value: 'cocoapods', label: 'CocoaPods' },
  { value: 'cratesio', label: 'Crates.io' },
  { value: 'github', label: 'GitHub' },
  { value: 'mavencentral', label: 'MavenCentral' },
  { value: 'npmjs', label: 'NpmJS' },
  { value: 'nuget', label: 'NuGet' },
  { value: 'pypi', label: 'PyPi' },
  { value: 'rubygems', label: 'RubyGems' }
]

const multiEditableFields = ['licensed.declared']

const noRowsHeight = 260

export {
  asObject,
  curateFilters,
  customLicenseIds,
  difference,
  licenses,
  noRowsHeight,
  providers,
  releaseDates,
  changes,
  setIfValue,
  sorts,
  sources,
  getParamsToUrl,
  getParamsFromUrl,
  types,
  multiEditableFields
}
