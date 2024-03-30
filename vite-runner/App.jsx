import React from './core/React.js'
const Bar = () => {
  React.useEffect(() => {
    console.log(222)
  }, [])
  return (
    <div>bar</div>
  )
}
const Foo = () => {
  console.log('foo render')
  const [count, setCount] = React.useState(0)
  const handleClick = () => {
    setCount(0)
  }
  React.useEffect(() => {
    console.log(11111)
  }, [count])
  return (
    <div>
      <h1>foo</h1>
      {count}
      {/* <Bar></Bar> */}
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