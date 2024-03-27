import React from './core/React.js'
function Counter({num}) {
  const handleClick = () => {
    console.log('hhh')
  }
  return <div onClick={handleClick}>count: {num}</div>
}
const App = <div>
  hi-mini-react
  <Counter num={1}></Counter>
</div>
export default App