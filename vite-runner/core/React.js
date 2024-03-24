const createTextNode = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    },
  }
}

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'string' ? createTextNode(child) : child)
    }
  }
}
const render = (el, container) => {
  console.log(1)
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
}

// 下一个任务（节点）
let nextWorkOfUnit = null
function workLoop(deadline) {
 console.log(3) 
  let shouldYield = false
  while(!shouldYield && nextWorkOfUnit) {
    console.log(2)
    // 返回下一个节点
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    // 这里为什么是小于 1
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
const createDom = (type) => {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
const updateProps = (dom, props) => {
  Object.keys(props).forEach(attr => {
    if (attr !== 'children') {
      dom[attr] = props[attr]
    }
  })
}
const initChildren = (fiber) => {
  // 4. 建立关系 child sibling parent
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null, // child 和 sibling 初始化我们不知道
      sibling: null,
      parent: fiber,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 如果不是第一个孩子就需要绑定到sibling，也就是上一个孩子的sibling 上，所以我们需要知道上一个孩子
      prevChild.sibling = newFiber
    }
    // 考虑到我们还需要设置 parent.sibling，因为我们是从上往下获取的，所以work肯定是顶层也就是 parent，我们只能给 child 设置，
    // 但是如果直接在child 上加就会破坏原有结构,所以我们单独维护一个newWork 对象，
    prevChild = newFiber
  })
}
const performWorkOfUnit = (fiber) => {
  if (!fiber.dom) {
    // 1. 创建dom
    const dom =(fiber.dom =  createDom(fiber.type))
    // 2. 把 dom 添加到父容器内
    fiber.parent.dom.append(dom)
    // 3. 设置 dom 的 props
    updateProps(dom, fiber.props)
  }
  initChildren(fiber)
  // 5. 返回下一个节点
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent.sibling

}
requestIdleCallback(workLoop)
const React = {
  render,
  createElement
}
export default React