const { setIfValue } = require('./utils')

export class Provider {
  constructor(url) {
    const urlObject = new URL(url)
    this.pathname = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
    this.hostname = urlObject.hostname.replace('www.', '')
    this.urlPath = this.pathname.split('/')
    this.providers = [new NpmProvider(this.urlPath, this.hostname), new GitHubProvider(this.urlPath, this.hostname)]
  }

  get() {
    Promise.all(this.providers)
  }

  static checkValidHostname(providerHostnames, hostname) {
    return providerHostnames.indexOf(hostname) >= 0 && true
  }
}

export class NpmProvider {
  constructor(urlPath, hostname) {
    this.hostname = hostname
    this.hostnames = ['npmjs.org', 'npmjs.com']
    this.path = 'npm/npmjs'
    this.urlPath = urlPath
    this.getUrl = this.fromUrl()
  }

  fromUrl() {
    console.log(Provider.checkValidHostname(this.hostnames, this.hostname))
    console.log(this)
    if (this.urlPath.length === 5) {
      ;[, this.nameSpace, this.name, , this.revision] = this.urlPath
    } else {
      this.nameSpace = '-'
      ;[, this.name, , this.revision] = this.urlPath
    }
  }
}

export class GitHubProvider {
  constructor(urlPath, hostname) {
    this.hostname = hostname
    this.hostnames = ['github.com']
    this.path = 'git/github'
    this.urlPath = urlPath
    this.getUrl = this.fromUrl()
  }

  fromUrl() {
    console.log(Provider.checkValidHostname(this.hostnames, this.hostname))
    console.log(this)
    if (this.urlPath.length === 5) {
      ;[, this.nameSpace, this.name, , this.revision] = this.urlPath
    } else {
      this.nameSpace = '-'
      ;[, this.name, , this.revision] = this.urlPath
    }
  }
}
