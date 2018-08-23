import input from '../lib/input'

export default (() => {
  const
    GRAVITY = 5,
    FRICTION = 7,
    JUMP_ACCELERATION = 30,
    X_ACCELERATION = 1

  let
    x = 100,
    y = 0,
    xVel = 0,
    yVel = 0,
    jumping = true
    

  return {
    update(dt) {
      const controls = input()
      if (controls.up && !jumping) {
        jumping = true
        yVel -= JUMP_ACCELERATION
      }

      if (controls.left) {
        xVel -= X_ACCELERATION
      }

      if (controls.right) {
        xVel += X_ACCELERATION
      }

      // Handle horizontal friction
      const xDiff = 0 - xVel
      if (Math.abs(xDiff) >= X_ACCELERATION) {
        xVel += (xDiff / FRICTION)
      } else {
        xVel = 0
      }

      // Handle vertical gravity
      const gDiff = GRAVITY - yVel
      if (Math.abs(gDiff) >= 2) {
        yVel += gDiff / GRAVITY
      } else {
        yVel = GRAVITY
      }

      // clamp speed
      if (xVel >= 15) {
        xVel = 15
      }
      if (xVel <= -15) {
        xVel = -15
      }
  
      x += xVel
      y += yVel
  
      if (y > 320) {
        y = 320
        yVel = 0
        jumping = false
      }
    },

    render(ctx) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, 16, 16)
    }
  }
})()