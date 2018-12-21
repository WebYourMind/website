// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import parse from 'spdx-expression-parse'
const NOASSERTION = 'NOASSERTION'

// Shared methods appliable to License Picker
export default class LicensePickerUtils {
  // Returns a license string based on the rules in input, following the specification of https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
  static getLicenseString(rules) {
    return rules
      .filter(rule => rule.license && rule.license !== '')
      .map((rule, index) => {
        return `${rules[index - 1] && rules[index - 1].operator !== '' ? `${rules[index - 1].operator} ` : ''}${
          rule.license
        }${rule.laterVersions ? '+' : ''}${
          rule.childrens.length ? ` ${rule.operator} (${this.getLicenseString(rule.childrens)})` : ''
        }`
      })
      .join(` `)
  }

  static parseLicense(license) {
    return license ? parse(license) : {}
  }

  static stringify(obj) {
    if (obj.hasOwnProperty('noassertion')) return NOASSERTION
    if (obj.license) return `${obj.license}${obj.plus ? '+' : ''}${obj.exception ? ` WITH ${obj.exception}` : ''}`
    const left = obj.left.conjunction === 'or' ? `(${this.stringify(obj.left)})` : this.stringify(obj.left)
    const right = obj.right.conjunction === 'or' ? `(${this.stringify(obj.right)})` : this.stringify(obj.right)
    return `${left} ${obj.conjunction.toUpperCase()} ${right}`
  }
}
