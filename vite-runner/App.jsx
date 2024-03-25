import React from './core/React.js'
function Counter() {
  return <div>count</div>
}
function CounterContainer () {
  return <Counter></Counter>
}
const App = <div>
  hi-mini-react
  <CounterContainer></CounterContainer>
</div>
export default App