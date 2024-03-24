
function workLoop(deadline) {
  console.log(deadline.timeRemaining())
  let shouldYield = false
  while(!shouldYield) {
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)