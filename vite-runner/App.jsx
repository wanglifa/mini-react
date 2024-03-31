import React from './core/React.js'
const Bar = () => {
  React.useEffect(() => {
    console.log('bar')
  }, [])
  return (
    <div>bar</div>
  )
}
const Foo = () => {
  console.log('foo render')
  const [count, setCount] = React.useState(0)
  const handleClick = () => {
    setCount((count) => count + 1)
  }
  React.useEffect(() => {
    console.log(11111)
    return () => {
      console.log('clearnup 0')
    }
  }, [])
  React.useEffect(() => {
    console.log(2222)
    return () => {
      console.log('cleanup 1')
    }
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
      <Bar></Bar>
    </div>
  )
}
export default App