// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { ROUTE_HARVEST } from '../utils/routingConstants'
import { harvestAction } from '../actions/harvestActions'
import { HarvestQueueList, GitHubSelector, NpmSelector, MavenSelector, NuGetSelector, Section } from './'
import { uiNavigation, uiHarvestUpdateQueue } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'

class PageHarvest extends Component {

  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github' }
    this.harvestHandler = this.harvestHandler.bind(this)
    this.onAddRequest = this.onAddRequest.bind(this)
    this.onRemoveRequest = this.onRemoveRequest.bind(this)
    this.onChangeRequest = this.onChangeRequest.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_HARVEST }))
  }

  harvestHandler(spec) {
    const { dispatch, token, queue } = this.props
    const requests = queue.list.map(entry => {
      return { type: entry.tool || entry.type, url: entry.toUrl(), policy: entry.policy }
    })
    dispatch(harvestAction(token, requests))
    // TODO clearly the harvest queue when everything is successfully queued
  }

  onAddRequest(value, tool) {
    const [namespace, name] = value.name.split('/')
    const path = [value.type, value.provider, name ? namespace : '-', name || namespace].join('/')
    const request = EntitySpec.fromPath(path)
    request.tool = tool
    this.props.dispatch(uiHarvestUpdateQueue({ add: request }))
  }

  onRemoveRequest(request) {
    this.props.dispatch(uiHarvestUpdateQueue({ remove: request }))
  }

  onChangeRequest(request, newRequest) {
    this.props.dispatch(uiHarvestUpdateQueue({ update: request, value: newRequest }))
  }

  onClick(event, thing) {
    const target = event.target
    const activeProvider = target.name
    this.setState({ ...this.state, activeProvider })
  }

  renderProviderButtons() {
    const { activeProvider } = this.state
    return (
      <ButtonGroup>
        <Button name='github' onClick={this.onClick} active={activeProvider === 'github'}>GitHub</Button>
        <Button name='maven' onClick={this.onClick} active={activeProvider === 'maven'}>Maven</Button>
        <Button name='npm' onClick={this.onClick} active={activeProvider === 'npm'}>NPM</Button>
        <Button name='nuget' onClick={this.onClick} active={activeProvider === 'nuget'}>NuGet</Button>
      </ButtonGroup>
    )
  }

  renderActionButton() {
    return (<Button className='pull-right' bsStyle='success' onClick={this.harvestHandler}>Harvest</Button>)
  }

  noRowsRenderer() {
    return <div>Use the search box above to add components to harvest.</div>
  }

  render() {
    const { activeProvider } = this.state
    const { queue } = this.props
    return (
      <Grid className='main-container'>
        <Row className='show-grid spacer'>
          <Col md={4}>
            {this.renderProviderButtons()}
          </Col>
          <Col md={7}>
            {activeProvider === 'github' && <GitHubSelector onChange={this.onAddRequest} />}
            {activeProvider === 'maven' && <MavenSelector onChange={this.onAddRequest} />}
            {activeProvider === 'npm' && <NpmSelector onChange={this.onAddRequest} />}
            {activeProvider === 'nuget' && <NuGetSelector onChange={this.onAddRequest} />}
          </Col>
        </Row>
        <Section name={'Components to harvest'} actionButton={this.renderActionButton()}>
          <div className='section-body'>
            <HarvestQueueList
              list={queue}
              listHeight={1000}
              onRemove={this.onRemoveRequest}
              onChange={this.onChangeRequest}
              noRowsRenderer={this.noRowsRenderer} />
          </div>
        </Section>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token, queue: state.ui.harvest.requestQueue
  }
}
export default connect(mapStateToProps)(PageHarvest)