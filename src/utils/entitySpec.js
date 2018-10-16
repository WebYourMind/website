// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const { setIfValue } = require('./utils')

const NAMESPACE = 0x4
const NAME = 0x2
const REVISION = 0x1
const NONE = 0

const toLowerCaseMap = {
  github: NAMESPACE | NAME,
  npmjs: NONE,
  mavencentral: NONE,
  mavencentralsource: NONE
}

const NPM_WEBSITE = 'npmjs.com'
const GITHUB_WEBSITE = 'github.com'
const MAVEN_WEBSITE = 'mvnrepository.com'
const NUGET_WEBSITE = 'nuget.org'
const PYPI_WEBSITE = 'pypi.org'
const RUBYGEM_WEBSITE = 'rubygems.org'

const acceptedFilesValues = ['application/json']

function normalize(value, provider, property) {
  if (!value) return value
  const mask = toLowerCaseMap[provider] || 0
  return mask & property ? value.toLowerCase() : value
}

export default class EntitySpec {
  static fromPath(path) {
    // eslint-disable-next-line no-unused-vars
    const [full, type, provider, namespace, name, revision, prSpec] = path.match(
      /\/*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?([^/]+)?(\/pr\/.+)?/
    )
    // eslint-disable-next-line no-unused-vars
    const [blank, delimiter, pr] = prSpec ? prSpec.split('/') : []
    return new EntitySpec(type, provider, namespace, name, revision, pr)
  }

  static checkDroppedFiles(files) {
    let acceptedFiles = []
    let rejectedFiles = []

    files.forEach(file => {
      const acceptedType = acceptedFilesValues.find(el => el === file.type)

      if (acceptedType) acceptedFiles.push(file)
      else rejectedFiles.push(file)
    })

    return {
      acceptedFiles,
      rejectedFiles
    }
  }

  static fromUrl(url) {
    const urlObject = new URL(url)
    const pathname = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
    const [packageName, name, version, revision] = pathname.split('/')
    const hostname = urlObject.hostname.replace('www.', '')
    let path

    switch (hostname) {
      case NPM_WEBSITE:
        if (revision) path = `npm/npmjs/-/${name}/${revision}`
        else path = `npm/npmjs/-/${name}`
        return path

      case GITHUB_WEBSITE:
        if (revision) path = `git/github/${packageName}/${name}/${revision}`
        else path = `git/github/${packageName}/${name}`
        return path

      case MAVEN_WEBSITE:
        if (revision) path = `maven/mavencentral/${name}/${version}/${revision}`
        else path = `maven/mavencentral/${name}/${version}`
        return path

      case NUGET_WEBSITE:
        if (version) path = `nuget/nuget/-/${name}/${version}`
        else path = `nuget/nuget/-/${name}`
        return path

      case PYPI_WEBSITE:
        if (version) path = `pypi/pypi/-/${name}/${version}`
        else path = `pypi/pypi/-/${name}`
        return path

      case RUBYGEM_WEBSITE:
        if (revision) path = `gem/rubygems/-/${name}/${revision}`
        else path = `gem/rubygems/-/${name}`
        return path

      default:
        return null
    }
  }

  static fromCoordinates(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name, o.revision, o.pr, o.changes)
  }

  static asRevisionless(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name)
  }

  static validateAndCreate(o) {
    if (o && typeof o === 'object' && o.name && o.provider && o.revision && o.type) return this.fromCoordinates(o)
  }

  static isEquivalent(one, other) {
    return (
      other &&
      one.type === other.type &&
      one.provider === other.provider &&
      one.namespace === other.namespace &&
      one.name === other.name &&
      one.revision === other.revision
    )
  }

  constructor(type, provider, namespace, name, revision = null, pr = null, changes = null) {
    this.type = type.toLowerCase()
    this.provider = provider.toLowerCase()
    setIfValue(this, 'namespace', namespace === '-' ? null : normalize(namespace, this.provider, NAMESPACE))
    this.name = normalize(name, this.provider, NAME)
    setIfValue(this, 'revision', normalize(revision, this.provider, REVISION))
    setIfValue(this, 'pr', pr)
    setIfValue(this, 'changes', changes)
  }

  toPath() {
    const revisionPart = this.revision ? `/${this.revision}` : ''
    const prPart = this.pr ? `/pr/${this.pr}` : ''
    return `${this.type}/${this.provider}/${this.namespace || '-'}/${this.name}${revisionPart}${prPart}`
  }

  toString() {
    return this.toPath()
  }
}
