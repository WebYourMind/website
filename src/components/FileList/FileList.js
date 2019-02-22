import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd'
import CopyrightsRenderer from '../../components/CopyrightsRenderer'
import LicensesRenderer from '../../components/LicensesRenderer'
import FacetsRenderer from '../../components/FacetsRenderer'
import Contribution from '../../utils/contribution'
import FileListSpec from '../../utils/filelist'
export default class FileList extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    }
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    })
  }

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age'
      }
    })
  }

  render() {
    const { readOnly, component, previewDefinition, files } = this.props
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        ...this.getColumnSearchProps('name'),
        render: (text, record, index) => <span>{text}</span>
      },
      {
        title: 'Facets',
        dataIndex: 'facets',
        key: 'facets',
        sorter: (a, b) => a.facets.length - b.facets.length,
        sortOrder: sortedInfo.columnKey === 'facets' && sortedInfo.order,
        ...this.getColumnSearchProps('facets'),
        render: (value, record) => <FacetsRenderer values={value || []} />
      },
      {
        title: 'Licenses',
        dataIndex: 'license',
        key: 'license',
        sorter: (a, b) => a.license.length - b.license.length,
        sortOrder: sortedInfo.columnKey === 'license' && sortedInfo.order,
        ...this.getColumnSearchProps('license'),
        render: (value, record) => (
          <LicensesRenderer
            field={`files[${record.id}].license`}
            readOnly={readOnly}
            initialValue={'MIT'}
            value={'MIT'}
            onChange={license => {
              this.props.onChange(`files[${record.id}]`, license, null, license => {
                const attributions = Contribution.getValue(
                  component.item,
                  previewDefinition,
                  `files[${record.id}].attributions`
                )
                return {
                  path: record.path,
                  license,
                  ...(attributions ? { attributions } : {})
                }
              })
            }}
          />
        )
      },
      {
        title: 'Copyrights',
        dataIndex: 'attributions',
        key: 'facets',
        sorter: (a, b) => a.facets.length - b.facets.length,
        sortOrder: sortedInfo.columnKey === 'facets' && sortedInfo.order,
        ...this.getColumnSearchProps('facets'),
        render: (value, record) => (
          <CopyrightsRenderer
            field={record && `files[${record.id}].attributions`}
            container={document.getElementsByClassName('ReactTable')[0]}
            item={value}
            readOnly={readOnly}
            selections={false}
            onSave={value => {
              this.props.onChange(`files[${record.id}]`, value, null, value => {
                return {
                  path: record.path,
                  license: Contribution.getValue(component.item, previewDefinition, `files[${record.id}].license`),
                  attributions: value
                }
              })
            }}
          />
        )
      }
    ]
    return (
      <Table
        columns={columns}
        dataSource={FileListSpec.pathToTreeFolders(files)}
        onChange={this.handleChange}
        pagination={false}
      />
    )
  }
}
