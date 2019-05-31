import React from 'react'
import PropTypes from 'prop-types'
import { kea } from 'kea'

const aboutLogic = kea({
  path: () => ['pages', 'about'],
  actions: () => ({
    increment: amount => ({ amount }),
    decrement: amount => ({ amount })
  }),
  reducers: ({ actions }) => ({
    acounter: [
      0,
      PropTypes.number,
      {
        [actions.increment]: (state, payload) => state + payload.amount,
        [actions.decrement]: (state, payload) => state - payload.amount
      }
    ]
  }),
  selectors: ({ selectors }) => ({
    adoubleCounter: [
      () => [selectors.acounter],
      counter => counter * 2,
      PropTypes.number
    ]
  })
})

function About ({ acounter, adoubleCounter, actions: { increment, decrement }}) {
  return (
    <div>
      <strong>About</strong>
      <p>Counter: {acounter}</p>
      <p>Double Counter: {adoubleCounter}</p>
      <button type="button" onClick={() => increment(1)}>
        Increment
      </button>
      <button type="button" onClick={() => decrement(1)}>
        Decrement
      </button>
    </div>
  )
}

export default aboutLogic(About)
