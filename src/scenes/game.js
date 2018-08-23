import input from '../lib/input'
import state from '../lib/state'
import hero from '../entities/hero'

export default (() => {
  return {
    update(dt) {
      const controls = input()
      if (controls.esc && state.get('gameState') === 'game') {
        state.set('gameState', 'menu')
      }

      hero.update(dt)
    },

    render(ctx) {
      hero.render(ctx)
    }
  }
})()