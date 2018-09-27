// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Grid, Button } from 'react-bootstrap'
import omitBy from 'lodash/omitBy'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import AntdButton from 'antd/lib/button'
import notification from 'antd/lib/notification'
import 'antd/dist/antd.css'
import {
  uiInspectGetDefinition,
  uiInspectGetCuration,
  uiInspectGetHarvested,
  uiNavigation,
  uiCurateGetDefinitionPreview,
  uiCurateResetDefinitionPreview,
  uiGetCurationsList
} from '../../actions/ui'
import { curateAction } from '../../actions/curationActions'
import { login } from '../../actions/sessionActions'
import { ROUTE_DEFINITIONS } from '../../utils/routingConstants'
import Contribution from '../../utils/contribution'
import Definition from '../../utils/definition'
import Auth from '../../utils/auth'
import ContributePrompt from '../ContributePrompt'
import FullDetailComponent from './FullDetailComponent'
import Curation from '../../utils/curation'

/**
 * Component that renders the Full Detail View as a Page or as a Modal
 * based on modalView property
 */
export class FullDetailPage extends Component {
  static defaultProps = {
    readOnly: false
  }

  constructor(props) {
    super(props)
    this.state = {
      changes: {}
    }
    this.handleNewSpec = this.handleNewSpec.bind(this)
    this.doContribute = this.doContribute.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleRevert = this.handleRevert.bind(this)
    this.onChange = this.onChange.bind(this)
    this.close = this.close.bind(this)
    this.contributeModal = React.createRef()
  }

  static propTypes = {
    // Define if the visualization should be as a Modal or as a Page
    modalView: PropTypes.bool,
    // To be used together with `modalView` property: if true, set the Modal as visible
    visible: PropTypes.bool,
    // Callback function callable when data needs to be saved
    onSave: PropTypes.func,
    // Callback function callable when the modal has been closed
    onClose: PropTypes.func,
    // If `modalView` is set to true, than path MUST be passed, otherwise it will be catched from the URL
    path: PropTypes.string,
    readOnly: PropTypes.bool
  }

  componentDidMount() {
    const { uiNavigation, component } = this.props
    if (component.changes) {
      this.setState({ changes: component.changes }, () => this.handleNewSpec(component))
    } else {
      this.handleNewSpec(component)
    }
    uiNavigation({ to: ROUTE_DEFINITIONS })
    this.handleSuggestions()
  }

  // Get the data for the current definition
  handleNewSpec(component) {
    const {
      token,
      uiInspectGetDefinition,
      uiInspectGetCuration,
      uiInspectGetHarvested,
      uiGetCurationsList
    } = this.props
    if (!component) return
    uiInspectGetDefinition(token, component)
    uiInspectGetCuration(token, component)
    uiInspectGetHarvested(token, component)
    uiGetCurationsList(token, component)
    this.previewDefinition(component)
  }

  /**
   * Dispatch the action to save a contribution
   * @param  {} constributionInfo object that describes the contribution
   */
  doContribute(constributionInfo) {
    const { token, component, curateAction } = this.props
    const { changes } = this.state
    const patches = Contribution.buildContributeSpec([], component, changes)
    const spec = { constributionInfo, patches }
    curateAction(token, spec)
  }

  // Action that calls the remote API that return a preview of the definition
  previewDefinition(nextComponent) {
    const { token, component, uiCurateGetDefinitionPreview } = this.props
    const { changes } = this.state
    if (
      (!component || isEmpty(component.changes)) &&
      (!nextComponent || isEmpty(nextComponent.changes)) &&
      isEmpty(changes)
    )
      return false
    const previewComponent = nextComponent ? nextComponent : component
    const patches = Contribution.buildPatch([], previewComponent, changes)
    uiCurateGetDefinitionPreview(token, previewComponent, patches)
  }

  // Shows the Modal to save a Contribution
  doPromptContribute() {
    const { changes } = this.state
    if (isEmpty(changes)) return
    this.contributeModal.current.open()
  }

  handleSave() {
    const { onSave, component, uiCurateResetDefinitionPreview } = this.props
    const { changes } = this.state
    const newComponent = { ...component, changes }
    this.setState({ changes: {} }, () => {
      uiCurateResetDefinitionPreview()
      onSave && onSave(component, newComponent)
    })
  }

  handleClose() {
    const { onClose } = this.props
    const { changes } = this.state
    if (isEmpty(changes)) return onClose()
    const key = `open${Date.now()}`
    const NotificationButtons = (
      <Fragment>
        <AntdButton
          type="primary"
          size="small"
          onClick={() => {
            this.close()
            notification.close(key)
          }}
        >
          Confirm
        </AntdButton>
        <AntdButton type="secondary" size="small" onClick={() => notification.close(key)}>
          Dismiss Notification
        </AntdButton>
      </Fragment>
    )
    notification.open({
      message: 'Unsaved Changes',
      description:
        'Some information have been changed and are currently unsaved. Are you sure to continue without saving?',
      btn: NotificationButtons,
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  handleRevert(value) {
    const { uiCurateResetDefinitionPreview } = this.props
    const { changes } = this.state
    if (isEmpty(changes)) return
    if (value) {
      const revertedChanges = omitBy(changes, (_, index) => index.startsWith(value))
      this.setState({ changes: revertedChanges, sequence: this.state.sequence + 1 }, () => this.previewDefinition())
      return
    }
    const key = `open${Date.now()}`
    const NotificationButtons = (
      <Fragment>
        <AntdButton
          type="primary"
          size="small"
          onClick={() =>
            this.setState({ changes: {} }, () => {
              uiCurateResetDefinitionPreview()
              notification.close(key)
            })
          }
        >
          Confirm
        </AntdButton>
        <AntdButton type="secondary" size="small" onClick={() => notification.close(key)}>
          Dismiss Notification
        </AntdButton>
      </Fragment>
    )
    notification.open({
      message: 'Confirm Revert?',
      description: 'Are you sure to revert all the unsaved changes from the current definition?',
      btn: NotificationButtons,
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  handleSuggestions() {
    const key = `open${Date.now()}`
    notification.open({
      description:
        'Another version of this defition has some recently updated data. \n \n Take a look at them and decide if to keep each data or discard it.',
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  close() {
    const { uiCurateResetDefinitionPreview, onClose } = this.props
    this.setState({ changes: {} }, () => {
      uiCurateResetDefinitionPreview()
      onClose()
    })
  }

  // Function called when a data has been changed
  onChange(item, value, type, transform) {
    const { component } = this.props
    const { changes } = this.state
    this.setState({ changes: Contribution.applyChanges(component, changes, item, value, type, transform) }, () =>
      this.previewDefinition()
    )
  }

  handleLogin(e) {
    e.preventDefault()
    Auth.doLogin((token, permissions, username) => {
      this.props.login(token, permissions, username)
    })
  }

  render() {
    const {
      path,
      definition,
      curation,
      harvest,
      modalView,
      visible,
      previewDefinition,
      readOnly,
      session,
      curationSuggestions
    } = this.props
    const { changes } = this.state

    console.log(curationSuggestions)
    return modalView ? (
      <Modal
        closable={false}
        // no need for default buttons
        footer={null}
        centered
        destroyOnClose={true}
        visible={visible}
        width={'85%'}
        className="fullDetaiView__modal"
      >
        {visible && (
          <FullDetailComponent
            curation={curation}
            definition={definition}
            harvest={harvest}
            path={path}
            readOnly={readOnly}
            modalView={modalView}
            onChange={this.onChange}
            handleClose={this.handleClose}
            handleSave={this.handleSave}
            previewDefinition={previewDefinition}
            changes={changes}
          />
        )}
      </Modal>
    ) : (
      <Grid>
        <FullDetailComponent
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          readOnly={readOnly}
          modalView={false}
          onChange={this.onChange}
          changes={changes}
          previewDefinition={previewDefinition}
          renderContributeButton={
            <Button bsStyle="success" disabled={isEmpty(changes)} onClick={this.doPromptContribute}>
              Contribute
            </Button>
          }
        />
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
      </Grid>
    )
  }
}

function mapStateToProps(state, props) {
  const { currentDefinition } = props

  const path = Definition.getPathFromUrl(props)
  const component = props.component || Definition.getDefinitionEntity(path)
  const curation = state.ui.inspect.curation && cloneDeep(state.ui.inspect.curation)
  const latestCuration = state.ui.inspect.latestCuration && cloneDeep(state.ui.inspect.latestCuration)

  let previewDefinition, definition

  if (currentDefinition && currentDefinition.otherDefinition) {
    previewDefinition = Contribution.getChangesFromPreview(currentDefinition.otherDefinition, currentDefinition)
    definition = { item: currentDefinition.otherDefinition }
  } else {
    previewDefinition = Definition.getDefinitionPreview(state)
    definition = state.ui.inspect.definition && cloneDeep(state.ui.inspect.definition)
  }

  return {
    path,
    component,
    filterValue: state.ui.inspect.filter && cloneDeep(state.ui.inspect.filter),
    token: state.session.token,
    session: state.session,
    definition,
    curation,
    harvest: state.ui.inspect.harvested && cloneDeep(state.ui.inspect.harvested),
    previewDefinition,
    curationSuggestions: Curation.getSuggestions(latestCuration.item, curation.item)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      uiInspectGetDefinition,
      uiInspectGetCuration,
      uiInspectGetHarvested,
      uiGetCurationsList,
      uiNavigation,
      curateAction,
      uiCurateGetDefinitionPreview,
      uiCurateResetDefinitionPreview
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullDetailPage)
