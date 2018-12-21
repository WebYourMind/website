// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component, Fragment } from 'react'
import toPath from 'lodash/toPath'
import SpdxPicker from '../SpdxPicker'

export default class RuleRenderer extends Component {
  constructor(props) {
    super(props)
  }

  renderRule = (rule, path) => {
    const { changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup } = this.props
    console.log(rule, path)
    if (rule.license || rule.license === '')
      return (
        <div style={{ padding: '10px' }}>
          <SpdxPicker value={rule.license} onChange={value => updateLicense(value, path)} />
          <div>
            <input type="checkbox" onChange={event => considerLaterVersions(event.target.checked, path)} value="+" />
            Any later version
          </div>
          <select onChange={event => changeRulesOperator(event.target.value, path)}>
            <option />
            <option>WITH</option>
            <option>AND</option>
            <option>OR</option>
          </select>
          <button onClick={() => addNewGroup([...path, 'license'])}>Add new Group</button>
        </div>
      )
    return (
      <Fragment>
        <div
          style={{ padding: '10px', border: rule.left && !rule.left.license ? '1px solid' : null }}
          key={toPath(path)}
        >
          {this.renderRule(rule.left, [...path, 'left'])}
        </div>
        <div
          style={{ padding: '10px', border: rule.right && !rule.right.license ? '1px solid' : null }}
          key={toPath(path)}
        >
          {this.renderRule(rule.right, [...path, 'right'])}
        </div>
      </Fragment>
    )
  }

  render() {
    const { rule } = this.props
    return Object.keys(rule).length > 0 ? this.renderRule(rule, []) : ''
  }
}
