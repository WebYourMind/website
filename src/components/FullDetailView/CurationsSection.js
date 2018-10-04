import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LabelRenderer from '../Renderers/LabelRenderer'
import TwoLineEntry from '../TwoLineEntry'
import Tag from 'antd/lib/tag'
import { ROUTE_CURATIONS } from '../../utils/routingConstants'

class CurationsSection extends Component {
  static propTypes = {
    curations: PropTypes.array,
    onClick: PropTypes.func
  }

  goToCuration = id => {
    const win = window.open(`${ROUTE_CURATIONS}/${id}`, '_blank')
    win.focus()
  }

  renderCuration = curation => (
    <TwoLineEntry
      key={`curation-${curation.number}`}
      onClick={() => this.goToCuration(curation.number)}
      headline={
        <span>
          #{curation.number} {curation.title}{' '}
          <Tag color={curation.status === 'merged' ? 'green' : 'gold '}>
            {curation.status === 'merged' ? 'Curated' : 'Pending'}
          </Tag>
        </span>
      }
      message={<span>@{curation.contributor}</span>}
    />
  )

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
