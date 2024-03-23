// 使用最基本的js创建 
// const dom = document.createElement('div')
// dom.id = 'dom'
// document.querySelector('#root').append(dom)

// const text = document.createTextNode('')
// text.nodeValue = 'app'
// dom.append(text)

// 使用 vdom
// 上面的div 和 text 如果看做 Object 会有 type props children 属性
// type -> div/textNode
// props -> {id: 'dom} 
// const textEl = {
//     type: 'TEXT_ELEMENT',
//     props: {
//       id: 'text',
//       nodeValue: 'app',
//     },
//       children: []
// }
// 问题：为什么要将children 放到 props 里而不是和 props 同级
// const el = {
//   type: 'div',
//   props: {
//     id: 'dom'
//   },
//   children: [
//     textEl
//   ]
// }
// const dom = document.createElement(el.type)
// dom.id = el.props.id
// document.querySelector('#root').append(dom)

// const text = document.createTextNode('')
// text.nodeValue = textEl.props.nodeValue
// dom.append(text)


// 3. 通过函数创建节点
const createTextNode = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
    },
      children: []
  }
}

const createElement = (type, props, ...children) => {
  return {
    type,
    props,
    children
  }
}

const App = createElement('div', {id: 'div'}, createTextNode('app'))
console.log(App, 'app')
const dom = document.createElement(App.type)
dom.id = App.props.id
document.querySelector('#root').append(dom)

const text = document.createTextNode('')
text.nodeValue = App.children[0].props.nodeValue
dom.append(text)


