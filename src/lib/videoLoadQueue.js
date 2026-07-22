const MAX_CONCURRENT = 2

let active = 0
const waiting = []

function pump() {
  while (active < MAX_CONCURRENT && waiting.length > 0) {
    const resolve = waiting.shift()
    active += 1
    let released = false
    resolve(() => {
      if (released) return
      released = true
      active -= 1
      pump()
    })
  }
}

/** Acquire a global video download slot. Call the returned release fn after first frame (or on teardown). */
export function acquireVideoSlot() {
  return new Promise((resolve) => {
    waiting.push(resolve)
    pump()
  })
}
