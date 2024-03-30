import React from './core/React.js'
const Foo = () => {
  console.log('foo render')
  const [count, setCount] = React.useState(0)
  const [age, setAge] = React.useState(1)
  const handleClick = () => {
    setCount((count) => count + 1)
    setAge((age) => age + 2)
  }
  return (
    <div>
      <h1>foo</h1>
      {count}
      {age}
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