import { getStore, resetContext, getContext } from 'kea'
import sagaPlugin from 'kea-saga'

const next = {
  name: 'next',
  afterWrapper (input, Klass, Kea) {
    if (Klass.getInitialProps) {
      Kea.getInitialProps = async function (ctx) {
        await Klass.getInitialProps(ctx)
      }
    }
  },
}

const preloadedState = {
  name: 'preloadedState',
  logicSteps: {
    defaults(logic, input) {
      const { inputs } = getContext();
      
      if (inputs.preloadedState) {
        let node = inputs.preloadedState

        for (const pathStep of logic.path) {
          if (node[pathStep]) {
            node = node[pathStep]
          } else {
            return
          }
        }

        if (typeof node !== 'undefined') {
          Object.assign(logic.defaults, node)
        }
      }
    }
  }
}

export const initStore = (initialState) => {
  resetContext({ 
    autoMount: false,
    inputs: { preloadedState: initialState },
    plugins: [sagaPlugin, next, preloadedState] 
  })

  const store = getStore({ preloadedState: initialState })

  return store
}

