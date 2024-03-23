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


// 3. 动态创建 vdom
// const createTextNode = (text) => {
//   return {
//     type: 'TEXT_ELEMENT',
//     props: {
//       nodeValue: text,
//     },
//       children: []
//   }
// }

// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props,
//     children
//   }
// }

// const App = createElement('div', {id: 'div'}, createTextNode('app'))
// console.log(App, 'app')
// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').append(dom)

// const text = document.createTextNode('')
// text.nodeValue = App.children[0].props.nodeValue
// dom.append(text)



// 动态创建节点
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
    children: children.map(child => typeof child === 'string' ? createTextNode(child) : child)
  }
}
const render = (el, container) => {
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
  Object.keys(el.props).forEach(attr => {
    dom[attr] = el.props[attr]
  })
  if (el.children && el.children.length) {
    console.log(el.children, 'vvvvvv')
    el.children.forEach((child) => render(child, dom))
  }
  console.log(container, 'c')
  container.append(dom)
}
const App = createElement('div', {id: 'div'}, 'app', 'hhh')
// render(App, document.querySelector('#root'))



// 改写成 react 的 api
// ReactDom.createRoot(document.getElementById('#root').render(<App />))

const ReactDom = {
createRoot(container) {
  return {
    render(app) {
      return render(app, container)
    }
  }
}
}
ReactDom.createRoot(document.getElementById('#root').render(App))