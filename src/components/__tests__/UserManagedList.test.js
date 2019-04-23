import UserManagedList from '../UserManagedList'
import { ROUTE_SHARE } from '../../utils/routingConstants'
import pako from 'pako'
import base64js from 'base64-js'

const testValues = ['red', 'white', 'blue']

describe('UserManagedList', () => {
  const urlExpectedStart = `${document.location.origin}${ROUTE_SHARE}/`
  let someList
  let copiedText, copiedMessage
  it('Instantiates an empty list', () => {
    someList = new UserManagedList({
      components: {
        list: [
          { type: 'rectangle', provider: testValues[0] },
          { type: 'rectangle', provider: testValues[1] },
          { type: 'rectangle', provider: testValues[2] }
        ]
      }
    })
    expect(someList).toBeInstanceOf(UserManagedList)
  })
  it('Copies a URL to clipboard', () => {
    someList.copyToClipboard = (text, message) => {
      copiedText = text
      copiedMessage = message
    }
    someList.doSaveAsUrl()
    expect(copiedText.substr(0, urlExpectedStart.length)).toEqual(urlExpectedStart)
    // https://github.com/clearlydefined/service/issues/447
    // expect(copiedText.length - urlExpectedStart.length).toBeLessThan(20)
  })
  it('Obtains properties roundtrip', () => {
    const path = copiedText.substr(urlExpectedStart.length)
    const definitionSpecString = pako.inflate(base64js.toByteArray(path), { to: 'string' })
    expect(definitionSpecString).toContain(testValues[0])
    expect(definitionSpecString).toContain(testValues[1])
    expect(definitionSpecString).toContain(testValues[2])
    const definitionSpec = JSON.parse(definitionSpecString)
    let secondList = new UserManagedList({
      components: { list: [] },
      dispatch: () => {},
      curations: { entries: {} },
      definitions: { entries: {} }
    })
    secondList.loadFromListSpec(definitionSpec)
  })
})
