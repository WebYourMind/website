import React, { Component } from 'react'
import LabelRenderer from '../Renderers/LabelRenderer'

class CurationsSection extends Component {
  render() {
    return (
      <div>
        <LabelRenderer text={'Curations'} />
        <p>No curations found for this component</p>
      </div>
    )
  }
}

export default CurationsSection
