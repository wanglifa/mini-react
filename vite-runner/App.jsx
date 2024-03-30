import React from './core/React.js'
let countFoo = 1
const Foo = () => {
  console.log('foo render')
  const update = React.update()
  const handleClick = () => {
    countFoo++
    update()
  }
  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countBar = 1
const Bar = () => {
  console.log('bar render')
  const update = React.update()
  const handleClick = () => {
    countBar++
    update()
  }
  return (
    <div>
      <h1>bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countApp = 1
function App() {
  console.log('app render')
  const update = React.update()
  const handleClick = () => {
    countApp++
    update()
  }
  return (
    <div>
      <h1>App</h1>
      {countApp}
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}
export default App