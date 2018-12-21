import React from 'react'
import { shallow } from 'enzyme'
import LicensePicker from '../LicensePicker'
const license = 'Apache-2.0 AND MIT'
describe('LicensePicker', () => {
  it('renders without crashing', () => {
    shallow(<LicensePicker />)
  })
  it('given an existing License, change the rule conjunction', () => {
    const wrapper = shallow(<LicensePicker value={license} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['left'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: { license: 'MIT' }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const wrapper = shallow(<LicensePicker value={license} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['right'])
    expect(wrapper.state('rules')).toEqual({
      conjunction: 'or',
      left: { conjunction: 'and', left: { license: 'Apache-2.0' }, right: { license: 'MIT' } },
      right: { license: '' }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 AND MIT AND GPL-1.0-only'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'and',
      right: {
        left: { license: 'MIT' },
        conjunction: 'and',
        right: { left: { license: 'GPL-1.0-only' }, conjunction: 'and', right: { license: '' } }
      }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 AND MIT AND GPL-1.0-only'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['right', 'left'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'and',
      right: {
        left: { license: 'MIT' },
        conjunction: 'or',
        right: { license: 'GPL-1.0-only' }
      }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 OR MIT OR GPL-1.0-only'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    console.log(JSON.stringify(wrapper.state('rules')))
    instance.changeRulesConjunction('and', ['right'])
    console.log(JSON.stringify(wrapper.state('rules')))
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: { left: { license: 'MIT' }, conjunction: 'and', right: { license: 'GPL-1.0-only' } }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only)'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    console.log(JSON.stringify(wrapper.state('rules')))
    instance.changeRulesConjunction('and', ['left'])
    console.log(JSON.stringify(wrapper.state('rules')))
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'and',
      right: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) OR MIT'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    console.log(JSON.stringify(wrapper.state('rules')))
    instance.changeRulesConjunction('and', ['right', 'left'])
    console.log(JSON.stringify(wrapper.state('rules')))
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } },
        conjunction: 'and',
        right: { license: 'MIT' }
      }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND MIT'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    console.log(JSON.stringify(wrapper.state('rules')))
    instance.changeRulesConjunction('or', ['right', 'right'])
    console.log(JSON.stringify(wrapper.state('rules')))
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: {
          left: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } },
          conjunction: 'and',
          right: { license: 'MIT' }
        },
        conjunction: 'or',
        right: { license: '' }
      }
    })
  })
  it('given an existing License, add a new rule conjunction', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND (MIT OR GPL-1.0-only)'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } },
        conjunction: 'and',
        right: { left: { license: 'MIT' }, conjunction: 'and', right: { license: 'GPL-1.0-only' } }
      }
    })
  })
})
