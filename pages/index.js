import React from 'react'
import PropTypes from 'prop-types'
import { kea, getContext } from 'kea'

import { put } from 'redux-saga/effects'

const indexLogic = kea({
  // path: () => ['pages', 'index'],
  actions: () => ({
    increment: amount => ({ amount }),
    decrement: amount => ({ amount })
  }),
  reducers: ({ actions }) => ({
    counter: [
      0,
      PropTypes.number,
      {
        [actions.increment]: (state, payload) => state + payload.amount,
        [actions.decrement]: (state, payload) => state - payload.amount
      }
    ]
  }),
  selectors: ({ selectors }) => ({
    doubleCounter: [
      () => [selectors.counter],
      counter => counter * 2,
      PropTypes.number
    ]
  }),
  start: function * () {
    console.log('saga started')
    yield put(this.actions.increment(10))
  },
  stop: function * () {
    console.log('saga stoppeds')
  },
  takeLatest: ({ actions }) => ({
    [actions.increment]: function * (action) {
      console.log('Increment called with', action.payload.amount)
    }
  })
})

function Index ({ counter, doubleCounter, actions: { increment, decrement }}) {
  console.log('index render')
  return (
    <div>
      <strong>Index</strong>
      <p>Counter: {counter}</p>
      <p>Double Counter: {doubleCounter}</p>
      <button type="button" onClick={() => increment(1)}>
        Increment
      </button>
      <button type="button" onClick={() => decrement(1)}>
        Decrement
      </button>
    </div>
  )
}

Index.getInitialProps = async function (ctx) {
  console.log('Index.getInitialProps')

  const { store } = getContext()

  store.dispatch(indexLogic.actions.increment(1))
}

export default indexLogic(Index)
