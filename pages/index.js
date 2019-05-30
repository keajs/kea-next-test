import React from 'react'
import PropTypes from 'prop-types'
import { kea } from 'kea'

const indexLogic = kea({
  path: () => ['kea', 'index'],
  options: { lazy: true },
  actions: () => ({
    increment: amount => ({ amount }),
    decrement: amount => ({ amount })
  }),
  reducers: ({ actions }) => ({
    counter: [
      0,
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
  takeLatest: ({ actions, workers }) => ({
    [actions.increment]: workers.updateCounter
  }),
  workers: {
    updateCounter: function * (action) {
      console.log('counter update triggered')
    }
  }
})

function Index ({ counter, doubleCounter, actions: { increment, decrement }}) {
  return (
    <div>
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

  indexLogic.mount()
  ctx.store.dispatch(indexLogic.actions.increment(1))

  // indexLogic.mount().then(({ actions, selectors }) => {
  //   console.log('indexLogic.mounted')
  //   ctx.store.dispatch(actions.increment(1))
  //   const counter = selectors.counter(ctx.store.getState())

  //   // or perhaps we could bind dispatch and getState automatically and run it like this:
  //   actions.increment(1)
  //   const counter = selectors.counter()
  // })
}

export default indexLogic(Index)
