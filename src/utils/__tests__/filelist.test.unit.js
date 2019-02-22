import FileListSpec from '../filelist'

const testFiles = [
  {
    path: 'LICENSE.md',
    token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
    license: 'MIT',
    natures: ['license']
  },
  { path: 'Newtonsoft.Json.nuspec' },
  { path: 'lib/net20/Newtonsoft.Json.dll' },
  { path: 'lib/net20/Newtonsoft.Json.xml' },
  { path: 'tools/install.ps1' },
  { path: '.signature.p7s' }
]
const expectedFolders = [
  {
    key: 1,
    name: 'LICENSE.md',
    license: 'MIT'
  },
  {
    key: 2,
    name: 'Newtonsoft.Json.nuspec'
  },
  {
    key: 1,
    name: '.signature.p7s'
  },
  {
    key: 2,
    name: 'lib',
    children: [
      {
        key: 3,
        name: 'net20',
        children: [
          {
            key: 4,
            name: 'Newtonsoft.Json.dll'
          },
          {
            key: 5,
            name: 'Newtonsoft.Json.xml'
          }
        ]
      }
    ]
  },
  {
    key: 1,
    name: 'tools',
    children: [
      {
        key: 2,
        name: 'install.ps1'
      }
    ]
  }
]

describe('FileListSpec', () => {
  it('renders without crashing', () => {
    const treeFolders = FileListSpec.pathToTreeFolders(testFiles)
    expect(treeFolders).toEqual(expectedFolders)
  })
})
