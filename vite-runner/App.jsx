import React from './core/React.js'
const Foo = () => {
  console.log('foo render')
  const [count, setCount] = React.useState(0)
  const handleClick = () => {
    setCount(0)
  }
  return (
    <div>
      <h1>foo</h1>
      {count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  console.log('app render')
  return (
    <div>
      <Foo></Foo>
    </div>
  )
}
export default App