import React from './React.js'
const ReactDom = {
  createRoot(container) {
    return {
      render(app) {
        return React.render(app, container)
      }
    }
  }
}
export default ReactDom