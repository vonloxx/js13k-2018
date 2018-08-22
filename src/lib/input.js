function Controls () {
  return {
    shift: Controls.keys[16],

    return: Controls.keys[13],
    start: Controls.keys[13],

    esc: Controls.keys[27],
    cancel: Controls.keys[27],

    w: Controls.keys[87],
    up: Controls.keys[87],

    s: Controls.keys[83],
    down: Controls.keys[83],

    a: Controls.keys[65],
    left: Controls.keys[65],

    d: Controls.keys[68],
    right: Controls.keys[68],

    space: Controls.keys[32],
    jump: Controls.keys[32],

    j: Controls.keys[73],
    button1: Controls.keys[73],

    k: Controls.keys[75],
    button2: Controls.keys[75],

    mouse: Controls.mouse
  }
}

Controls.keys = {}
Controls.mouse = {}

// Handle keys
addEventListener('keydown', e => Controls.keys[e.which] = true)
addEventListener('keyup', e => Controls.keys[e.which] = false)

// Handle mouse events
addEventListener('mousemove', e => { Controls.mouse['x'] = e.clientX; Controls.mouse['y'] = e.clientY })
addEventListener('mousedown', e => { Controls.mouse['down'] = true; Controls.mouse['up'] = false })
addEventListener('mouseup', e => { Controls.mouse['up'] = true; Controls.mouse['down'] = false })

export default Controls
