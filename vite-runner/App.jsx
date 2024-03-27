import React from './core/React.js'
let count = 10
function Counter({num}) {
  function handleClick() {
    console.log('clisk')
    count++
    React.update()
  }
  return (
    <div>
      count: {num}
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
  hi-mini-react
  <Counter num={10}></Counter>
    </div>
  )
}
export default App