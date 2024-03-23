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

const React = {
  render,
  createElement
}
export default React