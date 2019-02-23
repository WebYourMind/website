// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import orderBy from 'lodash/orderBy'
import Contribution from './contribution'

// Abstract methods for FileList
let key = 0
export default class FileListSpec {
  static pathToTreeFolders(files, component, preview) {
    const orderedFiles = orderBy(files, [file => file.path.split('/').length, 'path'], ['desc', 'asc'])
    const treeFolders = orderedFiles.reduce((result, file) => {
      const folders = file.path.split('/')
      result = this.getFolders({ ...file, folders }, result, component, preview, key)
      return result
    }, [])
    return treeFolders
  }

  static getFolders(file, result, component, preview) {
    if (file.folders.length === 1) {
      key++
      result.push({
        key,
        name: file.folders[file.folders.length - 1],
        license: file.license || null
        //facets: FileListSpec.getFileFacets(file.facets, component, preview, key),
        //attributions: FileListSpec.getFileAttributions(file.attributions, component, preview, key)
      })
    } else {
      const folderName = file.folders[0]
      file.folders.splice(0, 1)

      const index = result.findIndex(folder => folder.name === folderName)
      if (index !== -1) {
        result[index].children = this.getFolders({ ...file }, result[index].children, component, preview)
      } else {
        key++
        result.push({
          key,
          name: folderName,
          children: this.getFolders({ ...file }, [], component, preview)
        })
      }
    }
    return result
  }

  static getFileFacets(facets, component, preview, key) {
    if (!preview || !preview.files || !preview.files[key] || !preview.files[key].facets) {
      if (!facets)
        return [
          {
            value: 'core',
            isDifferent: false
          }
        ]
      return facets.map(f => {
        return {
          value: f,
          isDifferent: false
        }
      })
    }
    const previewObject = Object.assign([], preview.files[key].facets)
    if (component.files[key].facets && previewObject.length >= component.files[key].facets.length) {
      component.files[key].facets.map(
        (attribution, index) => !previewObject[index] && (previewObject[index] = attribution)
      )
    }
    return previewObject.map((_, index) =>
      Contribution.getValueAndIfDifferent(component, preview, `files[${key}].facets[${index}]`)
    )
  }

  static getFileAttributions(attributions, component, preview, key) {
    if (!preview || !preview.files || !preview.files[key] || !preview.files[key].attributions) {
      if (!attributions) return
      return Object.assign([], attributions).map(f => {
        return {
          value: f,
          isDifferent: false
        }
      })
    }
    const previewObject = Object.assign([], preview.files[key].attributions)
    if (component.files[key].attributions && previewObject.length >= component.files[key].attributions.length) {
      component.files[key].attributions.map(
        (attribution, index) => !previewObject[index] && (previewObject[index] = attribution)
      )
    }
    return previewObject.map((_, index) =>
      Contribution.getValueAndIfDifferent(component, preview, `files[${key}].attributions[${index}]`)
    )
  }
}

const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park'
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park'
          }
        ]
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park'
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]
