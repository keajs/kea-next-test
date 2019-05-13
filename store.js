import { getStore, activatePlugin } from 'kea'

activatePlugin({
  name: 'next',
  afterWrapper (input, Klass, Kea) {
    if (Klass.getInitialProps) {
      Kea.getInitialProps = async function (ctx) {
        await Klass.getInitialProps(ctx)
      }
    }
  }
})

export const initStore = (initialState) => getStore({
  preloadedState: initialState
})

