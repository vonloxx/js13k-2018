import STATIC_VERT from './static.vert'
import MERGE_FRAG from './merge.frag'
import BG_FRAG from './bg.frag'
import DITHER_FRAG from './dither.frag'

function getPaletteTexture(webgl, ctx) {
  const 
    width = ctx.canvas.width,
    height = ctx.canvas.height

  let gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0,    'rgb(255,   0,   0)')
  gradient.addColorStop(0.15, 'rgb(255,   0, 255)')
  gradient.addColorStop(0.33, 'rgb(0,     0, 255)')
  gradient.addColorStop(0.49, 'rgb(0,   255, 255)')
  gradient.addColorStop(0.67, 'rgb(0,   255,   0)')
  gradient.addColorStop(0.84, 'rgb(255, 255,   0)')
  gradient.addColorStop(1,    'rgb(255,   0,   0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  gradient = ctx.createLinearGradient(0, 0, width, 0)
  // gradient.addColorStop(0,    'rgba(255, 255, 255, 1)')
  // gradient.addColorStop(0.5,  'rgba(255, 255, 255, 0)')
  gradient.addColorStop(0.0, 'rgba(  0,   0,   0, 1)')
  gradient.addColorStop(0.5, 'rgba(  0,   0,   0, 0)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)')
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const texture = webgl.createTexture()
  webgl.setTexture(texture, ctx.canvas)

  return texture
}

export default (() => {
  let
    webgl,
    fbos,
    bgShader,
    mergeShader,
    ditherShader,
    paletteTexture

  return {
    init(w, ctx, bctx) {
      webgl = w

      bgShader = webgl.createShader(STATIC_VERT, BG_FRAG)
      ctx.uniform2f(webgl.uniformLocation(bgShader, 'resolution'), ctx.canvas.width, ctx.canvas.height)
      mergeShader = webgl.createShader(STATIC_VERT, MERGE_FRAG)

      paletteTexture = getPaletteTexture(webgl, bctx)
      ditherShader = webgl.createShader(STATIC_VERT, DITHER_FRAG)
      ctx.uniform2f(webgl.uniformLocation(ditherShader, 'dim'), ctx.canvas.width, ctx.canvas.height)
      ctx.uniform1f(webgl.uniformLocation(ditherShader, 'scale'), 1.0)
      ctx.uniform1f(webgl.uniformLocation(ditherShader, 'noiseAlpha'), .05)

      fbos = [webgl.createFBO(), webgl.createFBO()]
    },

    pre(ctx, time, dt) {
      webgl.bindFBO(fbos[0])
      webgl.bindShader(bgShader)
      ctx.uniform1f(webgl.uniformLocation(bgShader, 'time'), time/50)
      ctx.drawArrays(ctx.TRIANGLES, 0, 6)
    },

    post(ctx, texture, time, dt) {
      webgl.bindFBO(fbos[1])
      webgl.bindShader(mergeShader)
      ctx.uniform1i(webgl.uniformLocation(mergeShader, 't1'), webgl.bindTexture(texture, 0))
      ctx.uniform1i(webgl.uniformLocation(mergeShader, 't2'), webgl.bindTexture(webgl.getFBOTexture(fbos[0]), 1))
      ctx.drawArrays(ctx.TRIANGLES, 0, 6)

      webgl.bindFBO(fbos[0])
      webgl.bindShader(ditherShader)
      ctx.uniform1i(webgl.uniformLocation(ditherShader, 'texture'), webgl.bindTexture(webgl.getFBOTexture(fbos[1]), 0))
      // ctx.uniform1i(webgl.uniformLocation(ditherShader, 'texture'), webgl.bindTexture(texture, 0))
      ctx.uniform1i(webgl.uniformLocation(ditherShader, 'palette'), webgl.bindTexture(paletteTexture, 1))
      ctx.uniform1f(webgl.uniformLocation(ditherShader, 'time'), time / 1000.0)
      ctx.uniform1f(webgl.uniformLocation(ditherShader, 'offset'), Math.random() / 10.0)
      ctx.uniform1f(webgl.uniformLocation(ditherShader, 'shiftPal'), Math.sin(time / 10000))
      ctx.drawArrays(ctx.TRIANGLES, 0, 6)
  
    }
  }
})()