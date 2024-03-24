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
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
  Object.keys(el.props).forEach(attr => {
    if (attr !== 'children') {
      dom[attr] = el.props[attr]
    }
  })
  const children = el.props.children
  if (children && children.length) {
    children.forEach((child) => render(child, dom))
  }
  container.append(dom)
}

const React = {
  render,
  createElement
}
export default React