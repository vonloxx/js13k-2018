export default (() => {
  let 
    states = {},
    callbacks = []


  function triggerListener(index, value) {
    callbacks.forEach(cb => {
      if (cb.index === index) {
        cb.callback(value)
      }
    })
  }

  return {
    get(index) {
      return states[index]
    },

    set(index, value) {
      states[index] = value
      triggerListener(index, value)
    },

    addListener(index, callback) {
      callbacks.push({
        index, callback
      })
    }
  }
})()