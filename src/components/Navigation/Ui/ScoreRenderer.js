import React, { Component } from 'react'
import get from 'lodash/get'
import { getBadgeUrl } from '../../../api/clearlyDefined'

class ScoreRenderer extends Component {
  render() {
    const { domain, scores } = this.props
    return (
      <img
        className="list-buttons"
        src={
          domain
            ? getBadgeUrl(get(domain, 'toolScore.total'), get(domain, 'score.total'))
            : getBadgeUrl(scores.tool, scores.effective)
        }
        alt="score"
      />
    )
  }
}

export default ScoreRenderer
