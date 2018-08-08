// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Grid, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import 'antd/dist/antd.css'

import { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation } from '../../actions/ui'
import { curateAction } from '../../actions/curationActions'
import { ROUTE_DEFINITIONS } from '../../utils/routingConstants'
import EntitySpec from '../../utils/entitySpec'
import Contribution from '../../utils/contribution'
import ContributePrompt from '../ContributePrompt'
import FullDetailComponent from './FullDetailComponent'

/**
 * Component that renders the Full Detail View as a Page or as a Modal
 * based on modalView property
 *
 */
export class FullDetailPage extends Component {
  componentDidMount() {
    const { path, uiNavigation, component } = this.props

    if (path && component) {
      this.handleNewSpec(component)
    }
    uiNavigation({ to: ROUTE_DEFINITIONS })
  }

  componentWillReceiveProps(nextProps) {
    const { path, component } = nextProps

    if (path && path !== this.props.path) {
      this.handleNewSpec(component)
    }
  }

  /**
   * Get the data for the current definition
   *
   */
  handleNewSpec = component => {
    const { token, uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested } = this.props
    if (component) {
      uiInspectGetDefinition(token, component)
      uiInspectGetCuration(token, component)
      uiInspectGetHarvested(token, component)
    }
  }

  /**
   * Dispatch the action to save a contribution
   *
   */
  doContribute = description => {
    const { token, component } = this.props
    const patches = Contribution.buildContributeSpec({}, component)
    const spec = { description: description, patches }
    curateAction(token, spec)
  }

  /**
   * Shows the Modal to save a Contribution
   *
   */
  doPromptContribute = () => {
    const { component } = this.props
    if (!Contribution.hasChange(component)) return
    this.refs.contributeModal.open()
  }

  handleSave = changes => {
    const { onSave, component } = this.props
    const newComponent = { ...component, changes }
    onSave && onSave(component, newComponent)
  }

  handleClose = () => {
    const { onClose } = this.props
    onClose()
  }

  /**
   * update the state to keep track of the specific line item / file that has been changed
   *
   * @param {*} item
   */
  handleFileLicenseChange = item => {
    console.log(item)
  }

  render() {
    const { path, component, definition, curation, harvest, modalView, visible } = this.props

    return modalView ? (
      <Modal
        centered
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleSave}
        onCancel={this.handleClose}
        width={'85%'}
      >
        <FullDetailComponent
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          modalView={modalView}
        />
      </Modal>
    ) : (
      <Grid>
        <FullDetailComponent
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          modalView={false}
          handleFileLicenseChange={this.handleFileLicenseChange}
          renderContributeButton={
            <Button bsStyle="success" disabled={!Contribution.hasChange(component)} onClick={this.doPromptContribute}>
              Contribute
            </Button>
          }
        />
        <ContributePrompt ref="contributeModal" actionHandler={this.doContribute} />
      </Grid>
    )
  }
}

function mapStateToProps(state, props) {
  const path = props.path
    ? props.path
    : props.location
      ? props.location.pathname.slice(props.match.url.length + 1)
      : null
  const component = path ? EntitySpec.fromPath(path) : null

  return {
    path,
    component,
    filterValue: state.ui.inspect.filter,
    token: state.session.token,
    definition: state.ui.inspect.definition,
    curation: state.ui.inspect.curation,
    harvest: state.ui.inspect.harvested
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation, curateAction },
    dispatch
  )
}

FullDetailPage.propTypes = {
  /* Define if the visualization should be as a Modal or as a Page */
  modalView: PropTypes.bool,
  /* To be used together with `modalView` property: if true, set the Modal as visible */
  visible: PropTypes.bool,
  /* Callback function callable when data needs to be saved */
  onSave: PropTypes.func,
  /* Callback function callable when the modal has been closed */
  onClose: PropTypes.func,
  /* If `modalView` is set to true, than path MUST be passed, otherwise it will be catched from the URL */
  path: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullDetailPage)
