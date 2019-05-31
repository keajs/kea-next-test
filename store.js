// import { getStore, activatePlugin, resetContext } from 'kea'

// const next = {
//   name: 'next',
//   afterWrapper (input, Klass, Kea) {
//     if (Klass.getInitialProps) {
//       Kea.getInitialProps = async function (ctx) {
//         await Klass.getInitialProps(ctx)
//       }
//     }
//   }
// }

// export const initStore = (initialState) => {
//   console.log("in initstore")
//   resetContext({
//     plugins: [next],
//     autoMount: true
//   })

//   return getStore({
//     preloadedState: initialState
//   })
// }


