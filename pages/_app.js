import React from 'react'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import Layout from '../components/MyLayout'

import { getStore, resetContext, getContext, closeContext } from 'kea'
import sagaPlugin from 'kea-saga'

export const initKeaContext = (initialState = {}) => {
  console.log("in initKeaContext, got initialState", initialState)

  resetContext({
    debug: true,
    plugins: [sagaPlugin],
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
      initKeaContext()
    }

    console.log('store state in MyApp.getInitialProps', getContext().store.getState())

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    } else if (Component._wrapper && Component._wrappedKlass && Component._wrappedKlass.getInitialProps) {
      let unmount = Component._wrapper.mount && Component._wrapper.mount()

      pageProps = await Component._wrappedKlass.getInitialProps(ctx)

      unmount && unmount()
    }

    let initialState = {}
    if (typeof window === 'undefined') {
      initialState = getContext().store.getState()
    }

    if (typeof window === 'undefined') {
      // closeContext()
    }

    return { pageProps, initialState }
  }

  // this runs first on the client
  constructor (props) {
    if (typeof window !== 'undefined') {
    // TODO: Should we remove the "kea" paths from preloaded state? Otherwise we could have "kea.inline.COUNTER" conflicts...?
    // or maybe not because of the resetContext() in getInitialProps above?
      const { ...otherState } = props.initialState

      initKeaContext(otherState)

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
