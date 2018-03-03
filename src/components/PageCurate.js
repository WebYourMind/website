// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uiNavigation, uiCurateUpdateFilter, uiCurateGetCuration, uiCurateGetDefinition } from '../actions/ui'
import { Grid, Row, Col } from 'react-bootstrap'
import { CurationReview, ProposePrompt } from './'
import { ROUTE_CURATE } from '../utils/routingConstants'
import EntitySpec from '../utils/entitySpec'
import { curateAction } from '../actions/curationActions'
import { getDefinitionListAction } from '../actions/definitionActions'
import { FilterBar, CopyUrlButton } from './'
import { Button } from 'react-bootstrap'

class PageCurate extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.doPropose = this.doPropose.bind(this)
    this.doAction = this.doAction.bind(this)
    this.filterChanged = this.filterChanged.bind(this)
  }

  componentDidMount() {
    const { dispatch, token, path, filterValue } = this.props
    const pathToShow = path ? path : filterValue
    this.filterChanged(pathToShow)
    dispatch(uiNavigation({ to: ROUTE_CURATE }))
    dispatch(getDefinitionListAction(token))
  }

  componentWillReceiveProps(newProps) {
    // if the path is changing, update the filter to match. That will trigger getting the content
    const newPath = newProps.path
    if (this.props.path !== newPath)
      return this.props.dispatch(uiCurateUpdateFilter(newPath))

    // if the filter is changing (either on its own or because of the path), get the new content
    const newFilter = newProps.filterValue
    if (this.props.filterValue !== newFilter)
      this.handleNewSpec(newFilter)
  }

  // A new spec has been seleted, fetch all the details
  handleNewSpec(newFilter) {
    const { dispatch, token } = this.props
    if (!newFilter) {
      // TODO clear out the "current" values as we are not showing anything.
      return
    }
    const fullSpec = EntitySpec.fromPath(newFilter);
    this.setState({ ...this.state, entitySpec: fullSpec })
    const currentSpec = Object.assign(Object.create(fullSpec), fullSpec, { pr: null });
    if (fullSpec.pr) {
      dispatch(uiCurateGetCuration(token, fullSpec))
      dispatch(uiCurateGetDefinition(token, fullSpec))
    }
    dispatch(uiCurateGetCuration(token, currentSpec))
    dispatch(uiCurateGetDefinition(token, currentSpec))
  }

  doPropose(description) {
    const { dispatch, token } = this.props
    const { proposal, entitySpec } = this.state
    const spec = { description, patch: proposal }
    dispatch(curateAction(token, entitySpec, spec))
  }

  doMerge(spec) {
    const url = `https://github.com/clearlydefined/curated-data-dev/pull/${spec.pr}`;
    window.open(url, '_blank');
  }

  doAction(proposal) {
    const { entitySpec } = this.state
    if (entitySpec.pr)
      return this.doMerge(entitySpec)
    this.setState({ ...this.state, proposal })
    this.refs.proposeModal.open()
  }

  filterChanged(newFilter) {
    this.props.dispatch(uiCurateUpdateFilter(newFilter))
  }

  gotoValue(value) {
    this.props.history.push(`${ROUTE_CURATE}${value ? '/' + value : ''}`)
  }

  renderPlaceholder(message) {
    return (<div className='placeholder-message'>{message}</div>)
  }

  renderCurationView() {
    const { entitySpec } = this.state
    const { currentCuration, proposedCuration, currentDefinition, proposedDefinition, filterValue } = this.props
    if (!filterValue || !entitySpec)
      return this.renderPlaceholder('Search for some part of a component name to see details')
    // wait to render until we have the current content
    if (!currentCuration.isFetched || !currentDefinition.isFetched)
      return this.renderPlaceholder('Loading the curations and definitions for the requested component')
    // if we're doing a PR, wait for the PR content as well
    if (entitySpec.pr && (!proposedCuration.isFetched || !proposedDefinition.isFetched))
      return this.renderPlaceholder('Loading the curations and definitions for the requested component')
    const curationOriginal = currentCuration.item
    const curationValue = entitySpec.pr ? proposedCuration.item : curationOriginal
    const definitionOriginal = currentDefinition.item
    const definitionValue = entitySpec.pr ? proposedDefinition.item : definitionOriginal

    const actionText = entitySpec.pr ? 'Show on GitHub' : 'Save curation'
    return (
      <Col md={12} >
        <CurationReview
          curationOriginal={curationOriginal}
          curationValue={curationValue}
          definitionOriginal={definitionOriginal}
          definitionValue={definitionValue}
          actionHandler={this.doAction}
          actionText={actionText} />
      </Col>
    )
  }

  renderButtons() {
    return (
      <div className='labelled-button inline '>
        <Button className='pull-right' bsStyle='success'>Harvest more</Button>
      </div>
    )
  }

  render() {
    const { filterOptions, filterValue, isCurator, path } = this.props
    const searchWidth = isCurator ? 7 : 9
    return (
      <Grid className="main-container">
        <ProposePrompt ref="proposeModal" proposeHandler={this.doPropose} />
        <Row className="show-grid spacer">
          <Col md={searchWidth} mdOffset={1}>
            <FilterBar
              options={filterOptions}
              value={filterValue}
              onChange={this.filterChanged}
              defaultValue={path ? path : ''}
            />
          </Col>
          <Col md={1}>
            <CopyUrlButton route={ROUTE_CURATE} path={filterValue} bsStyle='default'/>
          </Col>
          {isCurator && <Col md={4}>{this.renderButtons()}</Col>}
        </Row>
        <Row className='top-space'>
          {this.renderCurationView()}
        </Row>
      </Grid >
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    path: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    token: state.session.token,
    isCurator: state.session.isCurator,
    currentCuration: state.ui.curate.currentCuration,
    currentDefinition: state.ui.curate.currentDefinition,
    proposedCuration: state.ui.curate.proposedCuration,
    proposedDefinition: state.ui.curate.proposedDefinition,
    filterValue: state.ui.curate.filter,
    filterOptions: state.definition.list
  }
}
export default connect(mapStateToProps)(PageCurate)
