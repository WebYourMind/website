import React from 'react'
import { mount, shallow } from 'enzyme'
import VersionSelector from '../VersionSelector'

describe('VersionSelector', () => {
  it('renders without crashing', () => {
    shallow(<VersionSelector />)
  })
})
