import input from './lib/input'
import state from './lib/state'
import menuScene from './scenes/menu'

export default (() => {
  let 
    ctx, // main context webgl
    bctx, // buffer context 2d
    rafId,
    lastDelta,
    activeScene

  function loop(timestamp) {
    const dt = timestamp - lastDelta

    update(dt)
    render()

    rafId = window.requestAnimationFrame(loop)
    lastDelta = timestamp
  }

  function update(dt) {
    activeScene.update(dt, state, input)
  }

  function render() {
    activeScene.render(bctx)
  }

  return {
    init(canvas, buffer) {
      ctx = canvas.getContext('webgl')
      bctx = buffer.getContext('2d')
      activeScene = menuScene
      state.set('gameState', 'menu')

      state.addListener('gameState', (value) => {
        console.log(value)
      })
    },

    start() {
      rafId = window.requestAnimationFrame(loop)
    },

    stop() {
      window.cancelAnimationFrame(rafId)
    }
  }
})()