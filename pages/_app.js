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
  console.log("in initstore")
  resetContext({
    plugins: [next]
    // autoMount: true
  })

  getStore({
    paths: ['kea', 'pages', 'scenes'],
    preloadedState: initialState
  })
}

if (typeof window !== 'undefined') {
  initStore()
  window.getContext = getContext
}

// const withKea = function (App) {
//   const isServer = typeof window === 'undefined';
 
//   return (

//   )

// }

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    console.log('myapp getinitalprops')

    if (typeof window === 'undefined') {
      initStore()
    }

    console.log('store state', getContext().store.getState())

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  constructor (props) {
    console.log('app constructor')
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

// export default withKea(initStore, { debug: process.env.NODE_ENV === 'development' })(MyApp)
