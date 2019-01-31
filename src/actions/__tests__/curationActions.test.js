import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import * as curationActions from '../curationActions'
import { CURATIONS, url } from '../../api/clearlyDefined'
import { asyncActions } from '..'
import { uiNotificationNew } from '../ui'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('curation actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
  it('creates DEFINITION_BODIES when fetching definitions has completed', async () => {
    const result = {
      url: 'http://test.url',
      prNumber: '123'
    }
    await fetchMock.patchOnce(url(`${CURATIONS}`), {
      body: result,
      headers: { 'content-type': 'application/json' }
    })
    const actions = asyncActions(curationActions.CURATION_POST)
    const prMessage = (
      <div>
        Successfully contributed{' '}
        <a href={result.url} target="_blank" rel="noopener noreferrer">
          PR#
          {result.prNumber}
        </a>
      </div>
    )
    const expectedActions = [
      actions.start(),
      uiNotificationNew({ type: 'info', message: 'Started contribution.', timeout: 5000 }),
      actions.success(result),
      uiNotificationNew({
        type: 'info',
        message: prMessage,
        timeout: 10000
      })
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(curationActions.curateAction()).then(() => {
      // return of async actions
      console.log(JSON.stringify(store.getActions()))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
