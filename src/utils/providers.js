// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Provider class is intended to exposing methods that could be used on each single specific provider
export class Provider {
  constructor() {
    // List of all accepted providers
    this.providers = [
      new NpmProvider(),
      new GitHubProvider(),
      new MavenProvider(),
      new PyPiProvider(),
      new NugetProvider(),
      new RubyGemProvider()
    ]
  }

  // Accept a URL, and passes to each single provider the properties to analyze it
  setUrl(url) {
    const urlObject = new URL(url)
    this.pathname = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
    this.hostname = urlObject.hostname.replace('www.', '')
    this.urlPath = this.pathname.split('/')
    this.providers.map(provider => provider.setUrl(this.urlPath, this.hostname))
  }

  // Given a URL, returns the path of the specific provider
  async getPath() {
    const path = await this.providers.reduce(async (result, provider) => {
      const isValid = await this.isValid(this.hostname, provider.hostnames)
      if (!isValid) return result
      const returnedPath = await provider.getPath()
      return returnedPath
    }, false)
    return path
  }

  isValid(hostname, hostnames) {
    return this.checkValidHostname(hostnames, hostname)
  }

  checkValidHostname(providerHostnames, hostname) {
    return providerHostnames.indexOf(hostname) >= 0 && true
  }
}

// Implements all the generic methods for the Providers
export class GenericProvider {
  setUrl(urlPath, hostname) {
    this.hostname = hostname
    this.urlPath = urlPath
  }

  providerErrorsFallback(provider) {
    return { errors: `${provider} need a version to be imported` }
  }
}

/**
 * Specific provider class that extends the basic functionality of the GenericProvider
 * Each provider could implement specific values and methods, used by the Provider class
 */
export class NpmProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['npmjs.org', 'npmjs.com'] // Hostnames accepted for this provider
    this.path = 'npm/npmjs' // Basic path structure for this provider
  }

  // Specific function to parse the URL structure and convert it to a Definition path
  getPath() {
    let nameSpace, name, revision
    if (this.urlPath.length === 5) {
      ;[, nameSpace, name, , revision] = this.urlPath
    } else {
      nameSpace = '-'
      ;[, name, , revision] = this.urlPath
    }
    return revision ? `${this.path}/${nameSpace}/${name}/${revision}` : this.providerErrorsFallback(this.hostname)
  }
}

export class GitHubProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['github.com']
    this.path = 'git/github'
  }

  getPath() {
    let packageName, name, revision
    if (this.urlPath.length === 5) {
      ;[packageName, name, , , revision] = this.urlPath
    } else {
      ;[packageName, name, , revision] = this.urlPath
    }
    return revision ? `${this.path}/${packageName}/${name}/${revision}` : this.providerErrorsFallback(this.hostname)
  }
}

export class MavenProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['mvnrepository.com']
    this.path = 'maven/mavencentral'
  }

  getPath() {
    const [, name, version, revision] = this.urlPath
    return revision ? `${this.path}/${name}/${version}/${revision}` : this.providerErrorsFallback(this.hostname)
  }
}

export class PyPiProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['pypi.org']
    this.path = 'pypi/pypi/-'
  }

  getPath() {
    const [, name, revision] = this.urlPath
    return revision ? `${this.path}/${name}/${revision}` : this.providerErrorsFallback(this.hostname)
  }
}

export class NugetProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['nuget.org']
    this.path = 'nuget/nuget/-'
  }

  getPath() {
    const [, name, revision] = this.urlPath
    return revision ? `${this.path}/${name}/${revision}` : this.providerErrorsFallback(this.hostname)
  }
}
export class RubyGemProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['rubygems.org']
    this.path = 'gem/rubygems/-'
  }

  getPath() {
    const [, name, , revision] = this.urlPath
    return revision ? `${this.path}/${name}/${revision}` : this.providerErrorsFallback(this.hostname)
  }
}
