// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component, Fragment } from 'react'
import SpdxPicker from '../SpdxPicker'

export default class RuleRenderer extends Component {
  constructor(props) {
    super(props)
  }

  renderRule = rule => {
    const { changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup } = this.props
    if (rule.license)
      return (
        <div style={{ padding: '10px' }}>
          <SpdxPicker value={rule.license} onChange={value => updateLicense(value, rule.id)} />
          <div>
            <input type="checkbox" onChange={event => considerLaterVersions(event.target.checked, rule.id)} value="+" />
            Any later version
          </div>
          <select onChange={event => changeRulesOperator(event.target.value, rule.id)}>
            <option />
            <option>WITH</option>
            <option>AND</option>
            <option>OR</option>
          </select>
          <button onClick={() => addNewGroup(rule)}>Add new Group</button>
          {/*rule.childrens.length > 0 && rule.childrens.map(children => this.renderRule(children))*/}
        </div>
      )
    return (
      <Fragment>
        <div style={{ padding: '10px', border: !rule.left.license ? '1px solid' : null }} key={rule.id}>
          {this.renderRule(rule.left)}
        </div>
        <div style={{ padding: '10px', border: !rule.right.license ? '1px solid' : null }} key={rule.id}>
          {this.renderRule(rule.right)}
        </div>
      </Fragment>
    )
  }

  render() {
    const { rule } = this.props
    return Object.keys(rule).length > 0 ? this.renderRule(rule) : ''
  }
}
