import React from './core/React.js'
import { TodoList } from './todoList/index.jsx'
function App() {
  console.log('app render')
  return (
    <div>
      <TodoList />
    </div>
  )
}
export default App