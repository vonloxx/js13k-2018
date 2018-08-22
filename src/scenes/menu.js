import input from '../lib/input'
import state from '../lib/state'

export default (() => {
  return {
    update(dt) {
      if (input().start && state.get('gameState') === 'menu') {
        state.set('gameState', 'game')
      }
    },

    render(ctx) {

    }
  }
})()