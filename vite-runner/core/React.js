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
      children: children.map(child => ['string', 'number'].includes(typeof child) ? createTextNode(child) : child)
    }
  }
}
const render = (el, container) => {
  root = (nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  })
}

let root = null
// 下一个任务（节点）
let nextWorkOfUnit = null
function workLoop(deadline) {
  let shouldYield = false
  while(!shouldYield && nextWorkOfUnit) {
    // 返回下一个节点
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    // 这里为什么是小于 1
    shouldYield = deadline.timeRemaining() < 1
  }
  // 链表结束
  if (!nextWorkOfUnit && root) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
const commitRoot = () => {
  // 这里为啥不是root.props.children
  commitWork(root.child)
  root = null
}
const commitWork = (fiber) => {
  // 如果在执行递归的时候执行了一半没时间了，不是依然还是只渲染了一部分节点吗
  if (!fiber) return
  let filberParent = fiber.parent
  while (!filberParent.dom) {
    filberParent = filberParent.parent
  }
  if (fiber.dom) {
    filberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
const createDom = (type) => {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
const updateProps = (dom, props) => {
  Object.keys(props).forEach(attr => {
    const isEvent = attr.startsWith('on')
    if (isEvent) {
      const eventType = attr.slice(2).toLocaleLowerCase()
      dom.addEventListener(eventType, props[attr])
    } else {
      if (attr !== 'children') {
        dom[attr] = props[attr]
      }
    }
  })
}
const initChildren = (fiber, children) => {
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
const updateFunctionComponent = (fiber) => {
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}
const updateHostComponent = (fiber) => {
    if (!fiber.dom) {
      // 1. 创建dom
      const dom =(fiber.dom =  createDom(fiber.type))
      // 3. 设置 dom 的 props
      updateProps(dom, fiber.props)
    }
  const children = fiber.props.children
  initChildren(fiber, children)
}
const performWorkOfUnit = (fiber) => {
  const isFunctionComonent = typeof fiber.type === 'function'
  if (!isFunctionComonent) {
    updateHostComponent(fiber)    
  } else {
    updateFunctionComponent(fiber)
  }
  // 5. 返回下一个节点
  if (fiber.child) {
    return fiber.child
  }
  let nextFilber = fiber
  while(nextFilber) {
    if (nextFilber.sibling) {
      return nextFilber.sibling
    }
    nextFilber = nextFilber.parent
  }

}
requestIdleCallback(workLoop)
const React = {
  render,
  createElement
}
export default React