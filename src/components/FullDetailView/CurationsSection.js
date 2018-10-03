import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LabelRenderer from '../Renderers/LabelRenderer'

class CurationsSection extends Component {
  static propTypes = {
    curations: PropTypes.array
  }

  renderCuration = curation => <p>{curation.title}</p>

  render() {
    const { curations } = this.props
    return (
      <div>
        <LabelRenderer text={'Curations'} />
        {curations ? (
          curations.map(curation => this.renderCuration(curation))
        ) : (
          <p>No curations found for this component</p>
        )}
      </div>
    )
  }
}

export default CurationsSection
