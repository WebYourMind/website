import { Provider, NpmProvider } from '../providers'

describe('Provider', () => {
  it('returns a provider object', () => {
    const provider = new Provider('https://www.npmjs.com/package/deep-diff')
    provider.get()
  })
})
