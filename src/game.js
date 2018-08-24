import input from './lib/input'
import state from './lib/state'
import webgl from './lib/webgl'
import scenes from './scenes/'

import shaders from './shaders/'

export default (() => {
  let 
    ctx, // main context webgl
    bctx, // buffer context 2d
    rafId,
    lastDelta,
    time = 0,
    activeScene,
    buffer,
    texture


  function setupWebGL() {
    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true)
  
    buffer = ctx.createBuffer()
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
      1.0, -1.0,
      1.0,  1.0
    ]), ctx.STATIC_DRAW)
  
    texture = webgl.createTexture()
  }

  function loop(timestamp) {
    const dt = timestamp - lastDelta
    time += dt || 0

    update(dt)
    render(dt)

    rafId = window.requestAnimationFrame(loop)
    lastDelta = timestamp
  }

  function update(dt) {
    activeScene.update(dt, state, input)
  }

  function render(dt) {
    shaders.pre(ctx, time, dt)

    bctx.clearRect(0, 0, bctx.canvas.width, bctx.canvas.height)
    activeScene.render(bctx)
    webgl.setTexture(texture, bctx.canvas)

    shaders.post(ctx, texture, time, dt)

    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
    ctx.drawArrays(ctx.TRIANGLES, 0, 6)
    ctx.flush()
  }

  return {
    init(canvas, buffer) {
      ctx = canvas.getContext('webgl')
      bctx = buffer.getContext('2d')
      webgl.init(ctx, ctx.canvas.width, ctx.canvas.height)
      activeScene = scenes['menu']
      state.set('gameState', 'menu')

      state.addListener('gameState', (value) => {
        activeScene = scenes[value]
      })

      setupWebGL()
      shaders.init(webgl, ctx, bctx)
    },

    start() {
      rafId = window.requestAnimationFrame(loop)
    },

    stop() {
      window.cancelAnimationFrame(rafId)
    }
  }
})()