import React from 'react'
import { shallow } from 'enzyme'
import FullDetailPage from '../FullDetailView/FullDetailPage'

describe('FullDetailPage', () => {
  it('renders without crashing', () => {
    shallow(<FullDetailPage modalView={false} />)
  })
})
