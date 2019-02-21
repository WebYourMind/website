// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

export default class Section extends Component {
  static propTypes = {
    actionButton: PropTypes.element,
    children: PropTypes.element,
    name: PropTypes.string
  }

  render() {
    const { name, actionButton, children } = this.props
    return (
      <>
        <Row className="section-header hidden-md hidden-lg hidden-sm">
          <Col xs={12}>
            <div className="section-title">{name}</div>
          </Col>
        </Row>
        <Row className="hidden-md hidden-lg hidden-sm">
          <Col xs={12}>
            <div className="section-button">{actionButton}</div>
          </Col>
        </Row>
        <Row className="section-header visible-md-block visible-lg-block visible-sm-block">
          <Col sm={3} md={4}>
            <div className="section-title">{name}</div>
          </Col>
          <Col sm={9} md={8}>
            <div className="section-button">{actionButton}</div>
          </Col>
        </Row>
        {children}
      </>
    )
  }
}
