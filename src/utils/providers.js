export class Provider {
  constructor(url) {
    const urlObject = new URL(url)
    this.pathname = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
    this.hostname = urlObject.hostname.replace('www.', '')
    this.urlPath = this.pathname.split('/')
    this.providers = [
      new NpmProvider(this.urlPath, this.hostname),
      new GitHubProvider(this.urlPath, this.hostname),
      new MavenProvider(this.urlPath, this.hostname),
      new PyPiProvider(this.urlPath, this.hostname),
      new NugetProvider(this.urlPath, this.hostname),
      new RubyGemProvider(this.urlPath, this.hostname)
    ]
  }

  async get() {
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

  static providerErrorsFallback(provider) {
    return { errors: `${provider} need a version to be imported` }
  }
}

export class GenericProvider {
  constructor(urlPath, hostname) {
    this.hostname = hostname
    this.urlPath = urlPath
  }
}

export class NpmProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['npmjs.org', 'npmjs.com']
    this.path = 'npm/npmjs'
  }

  getPath() {
    let nameSpace, name, revision
    if (this.urlPath.length === 5) {
      ;[, nameSpace, name, , revision] = this.urlPath
    } else {
      nameSpace = '-'
      ;[, name, , revision] = this.urlPath
    }
    return revision ? `${this.path}/${nameSpace}/${name}/${revision}` : Provider.providerErrorsFallback(this.hostname)
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
    return revision ? `${this.path}/${packageName}/${name}/${revision}` : Provider.providerErrorsFallback(this.hostname)
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
    return revision ? `${this.path}/${name}/${version}/${revision}` : Provider.providerErrorsFallback(this.hostname)
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
    return revision ? `${this.path}/${name}/${revision}` : Provider.providerErrorsFallback(this.hostname)
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
    return revision ? `${this.path}/${name}/${revision}` : Provider.providerErrorsFallback(this.hostname)
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
    return revision ? `${this.path}/${name}/${revision}` : Provider.providerErrorsFallback(this.hostname)
  }
}
