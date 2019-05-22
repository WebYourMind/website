import Contribution from '../contribution'

describe('Contribution', () => {
  it('returns a definition without a license', () => {
    var t0 = performance.now()
    for (let i = 0; i < 50000; i++) {
      Contribution.foldFacets(definitionWithoutLicense)
    }
    var t1 = performance.now()
    console.log("Call to foldFacets memoize'd took " + (t1 - t0) + ' milliseconds.')
    var t00 = performance.now()
    for (let i = 0; i < 50000; i++) {
      Contribution.foldFacetsRaw(definitionWithoutLicense)
    }
    var t11 = performance.now()
    console.log('Call to foldFacets raw took ' + (t11 - t00) + ' milliseconds.')
    const resultDefinition = Contribution.foldFacets(definitionWithoutLicense)
    expect(resultDefinition.licensed.declared).toBe(definitionWithoutLicense.licensed.declared)
  })
})

const definitionWithoutLicense = {
  described: {
    releaseDate: '2014-05-22',
    tools: ['clearlydefined/1'],
    toolScore: { total: 30, date: 30, source: 0 },
    score: { total: 30, date: 30, source: 0 }
  },
  licensed: {
    declared: 'NOASSERTION',
    toolScore: { total: 15, declared: 0, discovered: 0, consistency: 15, spdx: 0, texts: 0 },
    score: { total: 15, declared: 0, discovered: 0, consistency: 15, spdx: 0, texts: 0 }
  },
  coordinates: { type: 'nuget', provider: 'nuget', name: 'NuGet.VisualStudio', revision: '2.8.2' },
  _meta: { schemaVersion: '1.4.0', updated: '2019-01-31T15:52:01.267Z' }
}
