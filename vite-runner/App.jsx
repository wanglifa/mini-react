import React from './core/React.js'
function Counter({num}) {
  return <div>count: {num}</div>
}
const App = <div>
  hi-mini-react
  <Counter num={1}></Counter>
  <Counter num={2}></Counter>
</div>
export default App