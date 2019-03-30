// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Contribution from '../../../utils/contribution'
import TwoColumnsSection from '../Sections/TwoColumnsSection'
import {LicensePicker} from '@clearlydefined/ui-components'
import { FileCountRenderer } from '../..'

class LicensedSection extends Component {
  static propTypes = {
    rawDefinition: PropTypes.object,
    activeFacets: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    previewDefinition: PropTypes.object,
    curationSuggestions: PropTypes.object,
    handleRevert: PropTypes.func,
    applyCurationSuggestion: PropTypes.func
  }

  render() {
    const {
      rawDefinition,
      activeFacets,
      readOnly,
      onChange,
      previewDefinition,
      curationSuggestions,
      handleRevert,
      applyCurationSuggestion
    } = this.props
    const definition = Contribution.foldFacets(rawDefinition, activeFacets)
    const elements = [
      {
        label: 'Declared',
        field: 'licensed.declared',
        placeholder: 'SPDX license',
        type: 'license',
        editable: true,
        editor: LicensePicker
      },
      {
        multiple: true,
        label: 'Attributions',
        field: 'attribution.parties'
      },
      {
        label: 'Discovered',
        field: 'discovered.expressions',
        multiple: true
      },
      {
        editable: true,
        field: 'files',
        label: 'Files',
        component: <FileCountRenderer definition={definition} />
      }
    ]

    return (
      <TwoColumnsSection
        elements={elements}
        definition={definition}
        readOnly={readOnly}
        onChange={onChange}
        previewDefinition={previewDefinition}
        curationSuggestions={curationSuggestions}
        handleRevert={handleRevert}
        applyCurationSuggestion={applyCurationSuggestion}
      />
    )
  }
}

export default LicensedSection
