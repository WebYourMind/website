// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Row, Button, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Tabs from 'antd/lib/tabs'
import Tag from 'antd/lib/tag'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import { getBadgeUrl } from '../../api/clearlyDefined'
import FileList from '../FileList'
import InlineEditor from '../InlineEditor'
import MonacoEditorWrapper from '../MonacoEditorWrapper'
import FacetsEditor from '../FacetsEditor'
import 'antd/dist/antd.css'
import Contribution from '../../utils/contribution'

class FullDetailComponent extends Component {
  static propTypes = {
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
    curation: PropTypes.object.isRequired,
    definition: PropTypes.object.isRequired,
    harvest: PropTypes.object.isRequired,
    modalView: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    renderContributeButton: PropTypes.element,
    previewDefinition: PropTypes.object
  }

  renderLabel = text => (
    <p>
      <b>{text}</b>
    </p>
  )

  renderPanel(rawDefinition) {
    const { activeFacets, readOnly, onChange, previewDefinition } = this.props

    // TODO: find a way of calling this method less frequently. It's relatively expensive.
    const definition = Contribution.foldFacets(rawDefinition, activeFacets)

    const { licensed, described } = definition

    const previewFacets = Contribution.getValue(rawDefinition, previewDefinition, 'described.facets')
    const facets =
      previewFacets || Contribution.isSourceComponent(definition.coordinates)
        ? Contribution.mergeFacets(previewFacets)
        : ['core']
    const totalFiles = get(licensed, 'files')
    const unlicensed = get(licensed, 'discovered.unknown')
    const unattributed = get(licensed, 'attribution.unknown')
    const unlicensedPercent = totalFiles ? Contribution.getPercentage(unlicensed, totalFiles) : '-'
    const unattributedPercent = totalFiles ? Contribution.getPercentage(unattributed, totalFiles) : '-'
    const toolList = get(described, 'tools', []).map(tool => (tool.startsWith('curation') ? tool.slice(0, 16) : tool))

    return (
      <Row>
        <Col md={5}>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Declared')}</Col>
            <Col md={10} className="definition__line">
              <InlineEditor
                extraClass={Contribution.classIfDifferent(definition, previewDefinition, 'licensed.declared')}
                readOnly={readOnly}
                type="license"
                initialValue={Contribution.getOriginalValue(definition, 'licensed.declared')}
                value={Contribution.getValue(definition, previewDefinition, 'licensed.declared')}
                onChange={value => onChange(`licensed.declared`, value)}
                validator={true}
                placeholder={'SPDX license'}
              />
            </Col>
          </Row>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Source')}</Col>
            <Col md={10} className="definition__line">
              <InlineEditor
                extraClass={Contribution.classIfDifferent(definition, previewDefinition, 'described.sourceLocation')}
                readOnly={readOnly}
                type="text"
                initialValue={Contribution.printCoordinates(
                  Contribution.getOriginalValue(definition, 'described.sourceLocation')
                )}
                value={Contribution.printCoordinates(
                  Contribution.getValue(definition, previewDefinition, 'described.sourceLocation')
                )}
                onChange={value => onChange(`described.sourceLocation`, value, null, Contribution.parseCoordinates)}
                validator
                placeholder={'Source location'}
              />
            </Col>
          </Row>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Release')}</Col>
            <Col md={10} className="definition__line">
              <InlineEditor
                extraClass={Contribution.classIfDifferent(definition, previewDefinition, 'described.releaseDate')}
                readOnly={readOnly}
                type="date"
                initialValue={Contribution.printDate(
                  Contribution.getOriginalValue(definition, 'described.releaseDate')
                )}
                value={Contribution.printDate(
                  Contribution.getValue(definition, previewDefinition, 'described.releaseDate')
                )}
                onChange={value => onChange(`described.releaseDate`, value)}
                validator
                placeholder={'YYYY-MM-DD'}
              />
            </Col>
          </Row>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Facets')}</Col>
            <Col md={10} className="definition__line">
              <span>{facets && facets.map((facet, i) => <Tag key={i}>{facet}</Tag>)}</span>
            </Col>
          </Row>
        </Col>
        <Col md={7}>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Discovered')}</Col>
            <Col md={10} className="definition__line">
              <p
                className={`list-singleLine ${Contribution.classIfDifferent(
                  definition,
                  previewDefinition,
                  'licensed.discovered.expressions'
                )}`}
              >
                {get(licensed, 'discovered.expressions', []).join(', ')}
              </p>
            </Col>
          </Row>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Attribution')}</Col>
            <Col md={10} className="definition__line">
              <p
                className={`list-singleLine ${Contribution.classIfDifferent(
                  definition,
                  previewDefinition,
                  'licensed.attribution.parties'
                )}`}
              >
                {get(licensed, 'attribution.parties', []).join(', ')}
              </p>
            </Col>
          </Row>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Files')}</Col>
            <Col md={10} className="definition__line">
              <p className="list-singleLine">
                Total: <b>{totalFiles || '0'}</b>, Unlicensed:{' '}
                <b>{isNaN(unlicensed) ? '-' : `${unlicensed} (${unlicensedPercent}%)`}</b>, Unattributed:{' '}
                <b>{isNaN(unattributed) ? '-' : `${unattributed} (${unattributedPercent}%)`}</b>
              </p>
            </Col>
          </Row>
          <Row className="no-gutters">
            <Col md={2}>{this.renderLabel('Tools')}</Col>
            <Col md={10} className="definition__line">
              <p
                className={`list-singleLine ${Contribution.classIfDifferent(
                  definition,
                  previewDefinition,
                  'described.tools'
                )}`}
              >
                {toolList.join(', ')}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  renderPlaceholder(message) {
    return (
      <div className="placeholder-message inline section-body">
        <span>{message}</span>
      </div>
    )
  }

  renderInnerData(value, name, type = 'json', actionButton = null) {
    if (value.isFetching) return this.renderPlaceholder(`Loading the ${name}`)
    if (value.error && value.error.state !== 404)
      return this.renderPlaceholder(`There was a problem loading the ${name}`)
    if (!value.isFetched) return this.renderPlaceholder('Search for some part of a component name to see details')
    if (!value.item) return this.renderPlaceholder(`There are no ${name}`)
    const options = {
      selectOnLineNumbers: true
    }
    return (
      <MonacoEditorWrapper
        height="400"
        language={type}
        value={value.transformed}
        options={options}
        editorDidMount={this.editorDidMount}
      />
    )
  }

  renderHeader() {
    const { definition, modalView, changes } = this.props
    const { item } = definition
    return (
      <Row className="row-detail-header">
        <Col md={8}>
          <div className="detail-header">
            <h2>{item && item.coordinates.name}</h2>
            {item.described.sourceLocation && <p>commit id: {item.described.sourceLocation.revision}</p>}
          </div>
          <div className="score-header">
            <img className="list-buttons" src={getBadgeUrl(item)} alt="score" />
          </div>
        </Col>
        <Col md={4} className="text-right">
          {modalView && (
            <Button bsStyle="primary" disabled={isEmpty(changes)} onClick={this.props.handleSave}>
              OK
            </Button>
          )}{' '}
          {!modalView && this.props.renderContributeButton}{' '}
          {modalView && <Button onClick={this.props.handleClose}>Cancel</Button>}
        </Col>
      </Row>
    )
  }

  renderContributions() {
    return (
      <div>
        <h2>CONTRIBUTIONS</h2>
        <p>No contributions found for this component</p>
      </div>
    )
  }

  render() {
    const { curation, definition, harvest, onChange, previewDefinition, readOnly } = this.props

    if (!definition || !definition.item || !curation || !harvest) return null

    const item = { ...definition.item }
    const image = Contribution.getImage(item)

    return (
      <div>
        <Row>
          <Col md={1}>{image && <img className={`list-image`} src={image} alt="" />}</Col>
          <Col md={11}>
            {this.renderHeader()}
            {this.renderPanel(item)}
          </Col>
        </Row>
        <Row className="top-space">
          <Col md={6}>
            <FacetsEditor definition={item} onChange={onChange} previewDefinition={previewDefinition} />
          </Col>
          <Col md={6}>{this.renderContributions()}</Col>
        </Row>
        <Row className="top-space">
          <Col md={12}>
            <FileList
              files={cloneDeep(item.files)}
              onChange={onChange}
              component={definition}
              previewDefinition={previewDefinition}
              readOnly={readOnly}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tabs>
              <Tabs.TabPane tab="Current definition" key="1">
                {this.renderInnerData(definition, 'Current definition', 'yaml')}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Curations" key="2">
                {this.renderInnerData(curation, 'Curations', 'json')}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Harvested data" key="3">
                {this.renderInnerData(harvest, 'Harvested data', 'json')}
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}

export default FullDetailComponent
