import React from 'react'
import { shallow } from 'enzyme'
import { App, Header, Footer } from '../'

describe('App', () => {
  it('renders without crashing', () => {
    shallow(<App />)
  })
  it('renders the header', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find(Header).exists()).toBeTruthy()
  })
  it('renders the content', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.App-content').exists()).toBeTruthy()
  })
  it('renders the footer', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find(Footer).exists()).toBeTruthy()
  })
})
