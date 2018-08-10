// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import globToRegExp from 'glob-to-regexp'
import pickBy from 'lodash/pickBy'
import map from 'lodash/map'
import isEqual from 'lodash/isEqual'
import treeTableHOC from './treeTable'
import FilterCustomComponent from './FilterCustomComponent'
import FacetsRenderer from '../FacetsRenderer'
import LicensesRenderer from '../LicensesRenderer'
import CopyrightsRenderer from '../CopyrightsRenderer'
import Contribution from '../../utils/contribution'
import { describedColor } from '../Clearly'

/**
 * A File List Tree-view, according to https://github.com/clearlydefined/website/issues/191
 *
 */
export default class FileList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      files: [],
      expanded: {},
      isFiltering: false
    }

    this.generateColumns.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    //Data are parsed to create a tree-folder structure
    if (nextProps.files) {
      const files = parsePaths(nextProps.files, nextProps.changes, nextProps.component)
      nextProps.files && this.setState({ files, rawData: files })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.files.length !== this.state.files.length || !isEqual(nextProps.changes, this.props.changes)
  }

  generateColumns(columns) {
    return columns.concat([
      {
        Header: 'Name',
        accessor: 'name',
        resizable: false,
        style: {},
        Cell: row => <div style={{ paddingLeft: `${10 * (row.level - 1)}px` }}>{row.value}</div>,
        filterMethod: (filter, rows) =>
          rows.filter(
            item =>
              item._original ? item._original.path.toLowerCase().includes(filter.value.filterValue.toLowerCase()) : true
          ),
        filterAll: true
      },
      {
        Header: 'Facets',
        accessor: 'facets',
        resizable: false,
        Cell: row => <FacetsRenderer item={row} />,
        filterMethod: (filter, rows) =>
          rows.filter(
            item =>
              item._original && item._original.facets
                ? item._original.facets
                    .toString()
                    .toLowerCase()
                    .includes(filter.value.filterValue.toLowerCase())
                : true
          ),
        filterAll: true
      },
      {
        Header: 'Licenses',
        id: 'license',
        accessor: 'license',
        resizable: false,
        Cell: row => <LicensesRenderer item={row} />,
        filterMethod: (filter, rows) =>
          filter.value.filterValue
            ? rows.filter(
                item =>
                  item._original &&
                  item._original.license &&
                  item._original.license.toLowerCase().includes(filter.value.filterValue.toLowerCase())
              )
            : rows,
        filterAll: true
      },
      {
        Header: 'Copyrights',
        accessor: 'attributions',
        resizable: false,
        Cell: row => <CopyrightsRenderer item={row} showPopup={this.showPopup} />,
        filterMethod: (filter, rows) => {
          if (!filter.value.filterValue) return rows
          return rows.filter(item => {
            if (!item._original) return true
            if (!item._original.attributions) return false
            return item._original.attributions
              .toString()
              .toLowerCase()
              .includes(filter.value.filterValue.toLowerCase())
          })
        },
        filterAll: true
      }
    ])
  }

  render() {
    const { files, isFiltering } = this.state

    return (
      <div>
        <TreeTable
          showPagination={false}
          sortable={false}
          filterable={true}
          freezeWhenExpanded={false}
          manual={false}
          onFilteredChange={filtered => this.setState({ isFiltering: true })}
          noDataText={
            isFiltering ? "Current filters didn't match any data" : 'There are currently no files for this definition'
          }
          data={files}
          pivotBy={pathColums}
          columns={this.generateColumns(columns)} //Merge columns array with other columns to show after the folders
          FilterComponent={props => {
            return (
              !String(props.column.id)
                .toLowerCase()
                .includes('folder_') && <FilterCustomComponent {...props} />
            )
          }}
        />
      </div>
    )
  }
}

// Import Custom TreeTable HOC
const TreeTable = treeTableHOC(ReactTable)

const pathColums = []
const columns = []

/**
 * Parse Path to retrieve the complete folder structure
 * @param  {} files
 * @param  {} changes
 * @param  {} component
 */
const parsePaths = (files, changes, component) => {
  const changedFacets = pickBy(changes, (item, index) => index.startsWith('described.facets'))
  return files.map((file, index) => {
    file.facets = map(changedFacets, (glob, facets) => {
      if (!globToRegExp(glob).test(file.path)) return
      return facets
        .split('described.facets.')
        .pop()
        .trim()
    })

    file.areFacetsDifferent =
      file.facets.length > 0 && isEqual(Contribution.getOriginalValue(component, `files[${index}].facets`), file.facets)
        ? ''
        : 'facets__isEdited'

    const folders = file.path.split('/')

    // If files are in the root folder, then they will grouped into a "/" folder
    if (folders.length === 1) {
      file['folder_0'] = '/'
    } else {
      folders.unshift('/')
    }

    // Add file[`folder_${index}`] to file object
    // If index is the last file, then is the name of the file
    folders.forEach((p, index) => {
      if (index + 1 === folders.length) file.name = p
      else {
        file[`folder_${index}`] = p
      }
    })

    folders.forEach((p, index) => {
      if (index + 1 < folders.length && pathColums.indexOf(`folder_${index}`) === -1) {
        // Add folders_${index} to patchColumns array
        pathColums.push(`folder_${index}`)

        // Add folders_${index} to columns array
        columns.push({
          accessor: `folder_${index}`,
          show: false,
          aggregated: true,
          resizable: false
        })
      }
    })

    return file
  })
}
