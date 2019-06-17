import React from 'react'
import PropTypes from 'prop-types'
import { kea, getContext } from 'kea'

import { put, delay } from 'redux-saga/effects'

const indexLogic = kea({
  // path: () => ['pages', 'index'],
  actions: () => ({
    lazyIncrement: amount => ({ amount }),
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
    // we shouldn't call anything here, as this will always be called 2x, once
    // on the server and once on the client
    // yield put(this.actions.increment(10))
  },
  stop: function * () {
    console.log('saga stoppeds')
  },
  takeLatest: ({ actions }) => ({
    [actions.lazyIncrement]: function * (action) {
      console.log('lazyIncrement called with', action.payload.amount)

      const { increment } = this.actions

      // simulating async
      // this does not work yet
      yield delay(100)
      console.log('after delay')
      yield put(increment(action.payload.amount))
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

  const unmount = indexLogic.mount()
  store.dispatch(indexLogic.actions.increment(1))
  unmount()
}

export default indexLogic(Index)
