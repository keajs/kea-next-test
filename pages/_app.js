import React from 'react'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
// import withRedux from 'next-redux-wrapper'
// import { initStore } from '../store'
import Layout from '../components/MyLayout'

import { getStore, activatePlugin, resetContext, getContext } from 'kea'

const next = {
  name: 'next',
  afterWrapper (input, Klass, Kea) {
    if (Klass.getInitialProps) {
      Kea.getInitialProps = async function (ctx) {
        await Klass.getInitialProps(ctx)
      }
    }
  }
}

export const initStore = (initialState = {}) => {
  console.log("in initStore, got initialState", initialState)

  resetContext({
    debug: true,
    plugins: [next],
    attachStrategy: 'replace',
    detachStrategy: 'lazy'
  })

  getStore({
    paths: ['kea', 'pages', 'scenes'],
    preloadedState: initialState
  })
}

class MyApp extends App {
  // this runs first on the server
  static async getInitialProps({ Component, ctx }) {
    console.log('MyApp.getInitialProps')

    if (typeof window === 'undefined') {
      initStore()
    }

    console.log('store state in MyApp.getInitialProps', getContext().store.getState())

    // TODO: if on server and Component is Kea, mount the logic automatically

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    let initialState = {}

    if (typeof window === 'undefined') {
      initialState = getContext().store.getState()
    }

    return { pageProps, initialState }
  }

  // this runs first on the client
  constructor (props) {
    if (typeof window !== 'undefined') {
      const { kea, ...otherState } = props.initialState

      initStore(otherState)

      window.getContext = getContext
    }

    console.log('MyApp constructor')
    super(props)
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Provider store={getContext().store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    )
  }
}

export default MyApp
