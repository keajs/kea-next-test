import React from 'react'
import PropTypes from 'prop-types'
import { kea, getContext } from 'kea'

const aboutLogic = kea({
  // path: () => ['pages', 'about'],
  actions: () => ({
    increment: amount => ({ amount }),
    decrement: amount => ({ amount })
  }),
  reducers: ({ actions }) => ({
    aboutCounter: [
      0,
      PropTypes.number,
      {
        [actions.increment]: (state, payload) => state + payload.amount,
        [actions.decrement]: (state, payload) => state - payload.amount
      }
    ]
  }),
  selectors: ({ selectors }) => ({
    aboutDoubleCounter: [
      () => [selectors.aboutCounter],
      counter => counter * 2,
      PropTypes.number
    ]
  })
})

function About ({ aboutCounter, aboutDoubleCounter, actions: { increment, decrement }}) {
  console.log('about render')
  return (
    <div>
      <strong>About</strong>
      <p>Counter: {aboutCounter}</p>
      <p>Double Counter: {aboutDoubleCounter}</p>
      <button type="button" onClick={() => increment(1)}>
        Increment
      </button>
      <button type="button" onClick={() => decrement(1)}>
        Decrement
      </button>
    </div>
  )
}

About.getInitialProps = async function (ctx) {
  console.log('About.getInitialProps')

  const { store } = getContext()

  store.dispatch(aboutLogic.actions.increment(-1))
}

export default aboutLogic(About)
