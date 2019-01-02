// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LicensePickerUtils from './utils'
import valid from 'spdx-expression-validate'
import set from 'lodash/set'
import get from 'lodash/get'
import unset from 'lodash/unset'
import toPath from 'lodash/toPath'
import RuleRenderer from './RuleRenderer'

/**
 * A standalone SPDX License Picker
 * It allows to build a license string based on license expression rules:
 * https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
 */
export default class LicensePicker extends Component {
  constructor(props) {
    super(props)
    this.ruleObject = {
      license: '',
      conjunction: '',
      plus: false
    }
    this.licenseObject = {}
    this.state = {
      rules: {},
      sequence: 0
    }
  }
  static propTypes = {
    value: PropTypes.string //existing license
  }

  componentDidMount() {
    this.setState({
      licenseExpression: this.props.value,
      rules: LicensePickerUtils.parseLicense(this.props.value),
      isValid: this.props.value ? valid(this.props.value) : false
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { rules, sequence } = this.state
    if (sequence !== prevState.sequence) {
      const licenseExpression = LicensePickerUtils.stringify(rules)
      this.setState({ ...this.state, licenseExpression, isValid: valid(licenseExpression) })
    }
  }

  updateLicense = async (value, path) => {
    const rules = { ...this.state.rules }
    const currentPath = [...path, 'license']
    if (!value && currentPath !== ['license']) {
      unset(rules, `${currentPath}`)
    } else set(rules, toPath(currentPath), value || '')
    this.setState({ rules, sequence: this.state.sequence + 1 })
  }

  addNewRule = (path, conjunction) => {
    //const rules = { ...this.state.rules }
    // IF rules.path === {license} -> {left: {license}, conjunction, right:{}}
    /*const pathArray = toPath(path)
    if (pathArray.length === 1) rules.push({ ...this.ruleObject, id: new Date() })
    else {
      pathArray.splice(pathArray.length - 1)
      const rule = get(rules, pathArray)
      if (rule[rule.length - 1].id !== id) return
      rule.push({ ...this.ruleObject, id: new Date() })
      set(rules, pathArray, rule)
    }
    this.setState({ rules })*/
  }

  changeRulesConjunction = async (value, path) => {
    const rules = { ...this.state.rules }
    return this.setState(
      { rules: LicensePickerUtils.createRules(value, rules, path), sequence: this.state.sequence + 1 },
      () => value !== '' && this.addNewRule(path, value)
    )
  }

  considerLaterVersions = async (value, path) => {
    const rules = { ...this.state.rules }
    const currentPath = [...path, 'plus']
    set(rules, toPath(currentPath), value || false)
    this.setState({ rules, sequence: this.state.sequence + 1 })
  }

  addNewGroup = async rule => {
    // Add a children rule related to the index element
    const rules = [...this.state.rules]
    const path = await LicensePickerUtils.findPath(rules, rule.id)
    const childrens = [...get(rules, `${path}.childrens`)]
    childrens.push({ ...this.ruleObject, id: new Date() })
    set(rules, `${path}.childrens`, childrens)
    this.setState({ rules })
  }

  render() {
    const { rules, licenseExpression, isValid } = this.state
    return (
      <div>
        <div>
          License Expression: <span style={{ background: `${isValid ? 'green' : 'red'}` }}>{licenseExpression}</span>
        </div>
        <RuleRenderer
          rule={rules}
          changeRulesOperator={this.changeRulesConjunction}
          updateLicense={this.updateLicense}
          considerLaterVersions={this.considerLaterVersions}
          addNewGroup={this.addNewGroup}
        />
      </div>
    )
  }
}