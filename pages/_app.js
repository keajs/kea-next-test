import React from 'react'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import Layout from '../components/MyLayout'

import { closeContext, resetContext, getContext } from 'kea'
import sagaPlugin from 'kea-saga'

export const initKeaContext = (initialState = {}) => {
  console.log("in initKeaContext, got initialState", initialState)

  resetContext({
    defaults: initialState, // defaults for logic
    plugins: [sagaPlugin],
    attachStrategy: 'dispatch',
    detachStrategy: 'dispatch',
    createStore: {
      paths: ['kea', 'pages'],
      preloadedState: initialState // for non-kea reducers  
    }
  })
}

class MyApp extends App {
  // this runs first on the server
  static async getInitialProps({ Component, ctx }) {
    console.log('MyApp.getInitialProps')

    if (typeof window === 'undefined') {
      initKeaContext()
    }

    // console.log('store state in MyApp.getInitialProps', getContext().store.getState())

    // so we can still capture the state after the getInitialState logic unmounts
    getContext().options.detachStrategy = 'persist'

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    } else if (Component._wrapper && Component._wrappedComponent && Component._wrappedComponent.getInitialProps) {
      pageProps = await Component._wrappedComponent.getInitialProps(ctx)
    }

    let initialState = getContext().store.getState()

    getContext().options.detachStrategy = 'dispatch'

    console.log('returning from MyApp.getInitialProps', { pageProps, initialState })

    return { pageProps, initialState }
  }

  // this runs first on the client
  constructor (props) {
    console.log('MyApp constructor')

    if (typeof window !== 'undefined') {
      // remove here what is not needed
      const { ...otherState } = props.initialState
      initKeaContext(otherState)
      window.getContext = getContext
    }

    super(props)
  }

  render () {
    const { Component, pageProps } = this.props
    const { store } = getContext()

    return (
      <Container>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    )
  }
}

export default MyApp
