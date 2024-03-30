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
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextWorkOfUnit = wipRoot
}

let wipRoot = null
let currentRoot = null
// 下一个任务（节点）
let nextWorkOfUnit = null
let deletions = []
let wipFiber = null
let stateHooks
let stateHooksIndex
let effectHooks
function workLoop(deadline) {
  let shouldYield = false
  while(!shouldYield && nextWorkOfUnit) {
    // 返回下一个节点
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = null
    }
    // 这里为什么是小于 1
    shouldYield = deadline.timeRemaining() < 1
  }
  // 链表结束
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

const commitEffectHooks = () => {
  const run = (fiber) => {
    if (!fiber) return
    if (!fiber.alternate) {
      // init
      fiber.effectHooks?.forEach(hook => (hook.cleanup = hook?.callback()))
    } else {
      // update
      fiber.effectHooks?.forEach((newHook, index) => {
        if (newHook.deps.length > 0) {
          const oldEffect = fiber.alternate?.effectHooks[index]
          const needUpdate = newHook?.deps.some((dep, i) => {
            return dep !== oldEffect.deps[i]
          })

          needUpdate && (newHook.cleanup = newHook?.callback())
        }
      })
    }
    // 这里为啥要递归child 和 sibling
    // run(fiber.child)
    // run(fiber.sibling)
  }
  // run(wipRoot)
  // 在调用所有的 effect 之前调用 cleanup
  const runCleanup = (fiber) => {
    if (!fiber) return
    // 取上一次的 effectHooks
    fiber.alternate?.effectHooks?.forEach(hook => {
      // [] 不应该执行
      if (hook.deps.length > 0) {
        hook.cleanup?.()
      }
    })
    runCleanup(fiber.child)
    runCleanup(fiber.sibling)
  }

  runCleanup(wipFiber)
  run(wipFiber)
}

const commitDeletion = (fiber) => {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while(!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child) 
  }
}
const commitRoot = () => {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  commitEffectHooks()
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}
const commitWork = (fiber) => {
  // 如果在执行递归的时候执行了一半没时间了，不是依然还是只渲染了一部分节点吗
  if (!fiber) return
  let filberParent = fiber.parent
  while (!filberParent.dom) {
    filberParent = filberParent.parent
  }
  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === 'placement'){
    if (fiber.dom) {
      filberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

const createDom = (type) => {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
const updateProps = (dom, nextProps, prevProps) => {
  // 1. old 有 new 没有 -> 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2. old 没有 new 有 -> 添加
  // 3. new 有 old 也有 -> 修改
  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        // 不相等进行更新赋值
        const isEvent = key.startsWith('on')
        if (isEvent) {
          const eventType = key.slice(2).toLocaleLowerCase()
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}
const initChildren = (fiber, children) => {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    // 开始对比
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null, // child 和 sibling 初始化我们不知道
        sibling: null,
        parent: fiber,
        // 更新不会新创建 dom
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update'
      }
    } else {
      // 添加
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null, // child 和 sibling 初始化我们不知道
          sibling: null,
          parent: fiber,
          dom: null,
          effectTag: 'placement'
        }
      }
      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }
    if (oldFiber) {
      // 多个子级
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 如果不是第一个孩子就需要绑定到sibling，也就是上一个孩子的sibling 上，所以我们需要知道上一个孩子
      prevChild.sibling = newFiber
    }
    // 考虑到我们还需要设置 parent.sibling，因为我们是从上往下获取的，所以work肯定是顶层也就是 parent，我们只能给 child 设置，
    // 但是如果直接在child 上加就会破坏原有结构,所以我们单独维护一个newWork 对象，
    if (newFiber) {
      prevChild = newFiber
    }
  })
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}
const updateFunctionComponent = (fiber) => {
  stateHooks = []
  effectHooks = []
  stateHooksIndex = 0
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}
const updateHostComponent = (fiber) => {
    if (!fiber.dom) {
      // 1. 创建dom
      const dom =(fiber.dom =  createDom(fiber.type))
      // 3. 设置 dom 的 props
      updateProps(dom, fiber.props, {})
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

const update = () => {
  let currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextWorkOfUnit = wipRoot
  }
}
const useState = (inital) => {
  let currentFiber = wipFiber
  const oldHook = currentFiber.alternate?.stateHooks[stateHooksIndex]
  const stateHook = {
    state: oldHook ? oldHook.state : inital,
    queue: oldHook? oldHook.queue : []
  }
  stateHook.queue.forEach((action) => stateHook.state = action(stateHook.state))
  stateHook.queue = []
  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks

  const setState = (action) => {
    const eagerState = typeof action === 'function' ? action(stateHook.state) : action
    if (eagerState === stateHook.state) {
      return
    }
    stateHook.queue.push(typeof action === 'function' ? action : () => action)
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextWorkOfUnit = wipRoot
  }
  stateHooksIndex++
  return [stateHook.state, setState]
}
const useEffect = (callback, deps) => {
  const effectHook = {
    callback,
    deps,
    cleanup: undefined
  }
  effectHooks.push(effectHook)
  wipFiber.effectHooks = effectHooks
}
const React = {
  render,
  createElement,
  update,
  useState,
  useEffect
}
export default React