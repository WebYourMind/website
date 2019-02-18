import React, { Component } from 'react'
import { shallow } from 'enzyme'
import treeTableHOC from '../treeTable'

describe('treeTable test', () => {
  it('should render the component only when the condition passes', async () => {
    const ConditionalComponent = treeTableHOC(Component)
    const wrapper = shallow(<ConditionalComponent columns={transformedFolders} />)
    const instance = wrapper.instance()
    const transformedSubRows = await instance.getSubrows(subRows)
    console.log(transformedSubRows)
  })
  it('removes any undefined folder', () => {})
})

const subRows = [
  {
    _pivotID: 'folder_1',
    _pivotVal: 'undefined',
    folder_1: 'undefined',
    _subRows: [
      {
        _pivotID: 'folder_2',
        _pivotVal: 'undefined',
        folder_2: 'undefined',
        _subRows: [
          {
            _original: {
              path: 'LICENSE.md',
              token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
              license: 'MIT',
              natures: ['license'],
              id: 0,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              name: 'LICENSE.md'
            },
            _index: 0,
            _nestingLevel: 0,
            folder_0: '/',
            name: 'LICENSE.md',
            facets: [{ value: 'core', isDifferent: false }],
            license: 'MIT'
          },
          {
            _original: {
              path: 'Newtonsoft.Json.nuspec',
              id: 1,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              name: 'Newtonsoft.Json.nuspec'
            },
            _index: 1,
            _nestingLevel: 0,
            folder_0: '/',
            name: 'Newtonsoft.Json.nuspec',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: '.signature.p7s',
              id: 19,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              name: '.signature.p7s'
            },
            _index: 19,
            _nestingLevel: 0,
            folder_0: '/',
            name: '.signature.p7s',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      }
    ],
    _nestingLevel: 1,
    _groupedByPivot: true,
    _aggregated: true
  },
  {
    _pivotID: 'folder_1',
    _pivotVal: 'lib',
    folder_1: 'lib',
    _subRows: [
      {
        _pivotID: 'folder_2',
        _pivotVal: 'net20',
        folder_2: 'net20',
        _subRows: [
          {
            _original: {
              path: 'lib/net20/Newtonsoft.Json.dll',
              id: 2,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net20',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 2,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net20',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/net20/Newtonsoft.Json.xml',
              id: 3,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net20',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 3,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net20',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'net35',
        folder_2: 'net35',
        _subRows: [
          {
            _original: {
              path: 'lib/net35/Newtonsoft.Json.dll',
              id: 4,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net35',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 4,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net35',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/net35/Newtonsoft.Json.xml',
              id: 5,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net35',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 5,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net35',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'net40',
        folder_2: 'net40',
        _subRows: [
          {
            _original: {
              path: 'lib/net40/Newtonsoft.Json.dll',
              id: 6,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net40',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 6,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net40',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/net40/Newtonsoft.Json.xml',
              id: 7,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net40',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 7,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net40',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'net45',
        folder_2: 'net45',
        _subRows: [
          {
            _original: {
              path: 'lib/net45/Newtonsoft.Json.dll',
              id: 8,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net45',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 8,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net45',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/net45/Newtonsoft.Json.xml',
              id: 9,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'net45',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 9,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'net45',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'netstandard1.0',
        folder_2: 'netstandard1.0',
        _subRows: [
          {
            _original: {
              path: 'lib/netstandard1.0/Newtonsoft.Json.dll',
              id: 10,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'netstandard1.0',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 10,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'netstandard1.0',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/netstandard1.0/Newtonsoft.Json.xml',
              id: 11,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'netstandard1.0',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 11,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'netstandard1.0',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'netstandard1.3',
        folder_2: 'netstandard1.3',
        _subRows: [
          {
            _original: {
              path: 'lib/netstandard1.3/Newtonsoft.Json.dll',
              id: 12,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'netstandard1.3',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 12,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'netstandard1.3',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/netstandard1.3/Newtonsoft.Json.xml',
              id: 13,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'netstandard1.3',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 13,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'netstandard1.3',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'portable-net40+sl5+win8+wpa81+wp8',
        folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
        _subRows: [
          {
            _original: {
              path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.dll',
              id: 14,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 14,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.xml',
              id: 15,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 15,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      },
      {
        _pivotID: 'folder_2',
        _pivotVal: 'portable-net45+win8+wpa81+wp8',
        folder_2: 'portable-net45+win8+wpa81+wp8',
        _subRows: [
          {
            _original: {
              path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.dll',
              id: 16,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'portable-net45+win8+wpa81+wp8',
              name: 'Newtonsoft.Json.dll'
            },
            _index: 16,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'portable-net45+win8+wpa81+wp8',
            name: 'Newtonsoft.Json.dll',
            facets: [{ value: 'core', isDifferent: false }]
          },
          {
            _original: {
              path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.xml',
              id: 17,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'lib',
              folder_2: 'portable-net45+win8+wpa81+wp8',
              name: 'Newtonsoft.Json.xml'
            },
            _index: 17,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'lib',
            folder_2: 'portable-net45+win8+wpa81+wp8',
            name: 'Newtonsoft.Json.xml',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      }
    ],
    _nestingLevel: 1,
    _groupedByPivot: true,
    _aggregated: true
  },
  {
    _pivotID: 'folder_1',
    _pivotVal: 'tools',
    folder_1: 'tools',
    _subRows: [
      {
        _pivotID: 'folder_2',
        _pivotVal: 'undefined',
        folder_2: 'undefined',
        _subRows: [
          {
            _original: {
              path: 'tools/install.ps1',
              id: 18,
              facets: [{ value: 'core', isDifferent: false }],
              folder_0: '/',
              folder_1: 'tools',
              name: 'install.ps1'
            },
            _index: 18,
            _nestingLevel: 0,
            folder_0: '/',
            folder_1: 'tools',
            name: 'install.ps1',
            facets: [{ value: 'core', isDifferent: false }]
          }
        ],
        _nestingLevel: 2,
        _groupedByPivot: true,
        _aggregated: true
      }
    ],
    _nestingLevel: 1,
    _groupedByPivot: true,
    _aggregated: true
  }
]

const transformedFolders = [
  {
    path: 'LICENSE.md',
    token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
    license: 'MIT',
    natures: ['license'],
    id: 0,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    name: 'LICENSE.md'
  },
  {
    path: 'Newtonsoft.Json.nuspec',
    id: 1,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    name: 'Newtonsoft.Json.nuspec'
  },
  {
    path: 'lib/net20/Newtonsoft.Json.dll',
    id: 2,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net20',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/net20/Newtonsoft.Json.xml',
    id: 3,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net20',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'tools/install.ps1',
    id: 18,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'tools',
    name: 'install.ps1'
  },
  {
    path: '.signature.p7s',
    id: 19,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    name: '.signature.p7s'
  }
]
