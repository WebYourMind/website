import { parsePaths } from '../FileList'

describe('FileList test', () => {
  it('converts a file list to a tree', () => {
    const treeFolders = parsePaths(sampleFiles, sampleComponent)
    expect(treeFolders).toEqual(transformedFolders)
  })
})

const sampleFiles = [
  {
    path: 'LICENSE.md',
    token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
    license: 'MIT',
    natures: ['license']
  },
  { path: 'Newtonsoft.Json.nuspec' },
  { path: 'lib/net20/Newtonsoft.Json.dll' },
  { path: 'lib/net20/Newtonsoft.Json.xml' },
  { path: 'lib/net35/Newtonsoft.Json.dll' },
  { path: 'lib/net35/Newtonsoft.Json.xml' },
  { path: 'lib/net40/Newtonsoft.Json.dll' },
  { path: 'lib/net40/Newtonsoft.Json.xml' },
  { path: 'lib/net45/Newtonsoft.Json.dll' },
  { path: 'lib/net45/Newtonsoft.Json.xml' },
  { path: 'lib/netstandard1.0/Newtonsoft.Json.dll' },
  { path: 'lib/netstandard1.0/Newtonsoft.Json.xml' },
  { path: 'lib/netstandard1.3/Newtonsoft.Json.dll' },
  { path: 'lib/netstandard1.3/Newtonsoft.Json.xml' },
  { path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.dll' },
  { path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.xml' },
  { path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.dll' },
  { path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.xml' },
  { path: 'tools/install.ps1' },
  { path: '.signature.p7s' }
]
const sampleComponent = {
  described: {
    sourceLocation: {
      type: 'git',
      provider: 'github',
      namespace: 'JamesNK',
      name: 'Newtonsoft.Json',
      revision: '5a6ec030a9a88048f945d187a907ae3bab81af66',
      url: 'https://github.com/JamesNK/Newtonsoft.Json/tree/5a6ec030a9a88048f945d187a907ae3bab81af66'
    },
    releaseDate: '2017-04-02',
    tools: ['clearlydefined/1.2.0'],
    toolScore: { total: 100, date: 30, source: 70 },
    score: { total: 100, date: 30, source: 70 }
  },
  licensed: {
    declared: 'NOASSERTION',
    toolScore: { total: 15, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 15 },
    facets: { core: { attribution: { unknown: 20 }, discovered: { unknown: 19, expressions: ['MIT'] }, files: 20 } },
    score: { total: 15, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 15 }
  },
  files: [
    {
      path: 'LICENSE.md',
      token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
      license: 'MIT',
      natures: ['license']
    },
    { path: 'Newtonsoft.Json.nuspec' },
    { path: 'lib/net20/Newtonsoft.Json.dll' },
    { path: 'lib/net20/Newtonsoft.Json.xml' },
    { path: 'lib/net35/Newtonsoft.Json.dll' },
    { path: 'lib/net35/Newtonsoft.Json.xml' },
    { path: 'lib/net40/Newtonsoft.Json.dll' },
    { path: 'lib/net40/Newtonsoft.Json.xml' },
    { path: 'lib/net45/Newtonsoft.Json.dll' },
    { path: 'lib/net45/Newtonsoft.Json.xml' },
    { path: 'lib/netstandard1.0/Newtonsoft.Json.dll' },
    { path: 'lib/netstandard1.0/Newtonsoft.Json.xml' },
    { path: 'lib/netstandard1.3/Newtonsoft.Json.dll' },
    { path: 'lib/netstandard1.3/Newtonsoft.Json.xml' },
    { path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.dll' },
    { path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.xml' },
    { path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.dll' },
    { path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.xml' },
    { path: 'tools/install.ps1' },
    { path: '.signature.p7s' }
  ],
  coordinates: { type: 'nuget', provider: 'nuget', name: 'Newtonsoft.Json', revision: '10.0.2' },
  _meta: { schemaVersion: '1.4.0', updated: '2019-02-06T21:45:14.251Z' }
}

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
    path: 'lib/net35/Newtonsoft.Json.dll',
    id: 4,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net35',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/net35/Newtonsoft.Json.xml',
    id: 5,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net35',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'lib/net40/Newtonsoft.Json.dll',
    id: 6,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net40',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/net40/Newtonsoft.Json.xml',
    id: 7,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net40',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'lib/net45/Newtonsoft.Json.dll',
    id: 8,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net45',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/net45/Newtonsoft.Json.xml',
    id: 9,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'net45',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'lib/netstandard1.0/Newtonsoft.Json.dll',
    id: 10,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'netstandard1.0',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/netstandard1.0/Newtonsoft.Json.xml',
    id: 11,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'netstandard1.0',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'lib/netstandard1.3/Newtonsoft.Json.dll',
    id: 12,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'netstandard1.3',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/netstandard1.3/Newtonsoft.Json.xml',
    id: 13,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'netstandard1.3',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.dll',
    id: 14,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.xml',
    id: 15,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'portable-net40+sl5+win8+wpa81+wp8',
    name: 'Newtonsoft.Json.xml'
  },
  {
    path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.dll',
    id: 16,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'portable-net45+win8+wpa81+wp8',
    name: 'Newtonsoft.Json.dll'
  },
  {
    path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.xml',
    id: 17,
    facets: [{ value: 'core', isDifferent: false }],
    folder_0: '/',
    folder_1: 'lib',
    folder_2: 'portable-net45+win8+wpa81+wp8',
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
