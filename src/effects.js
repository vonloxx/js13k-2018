export default (() => {
  let 
    shaders = [],
    fbos = []


  return {
    init(webgl) {
      fbos = [webgl.glCreateFBO(), webgl.glCreateFBO()]
    },

    addEffect(fragment, sparams, rparams) {

    },

    renderPre(ctx) {

    },

    renderPost(ctx, bufferTexture) {

    }
  }
})()