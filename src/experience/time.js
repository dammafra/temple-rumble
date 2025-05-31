import Experience from '@experience'
import gsap from 'gsap'
import { EventDispatcher } from 'three'
import { Timer } from 'three/addons/misc/Timer.js'

export default class Time extends EventDispatcher {
  constructor() {
    super()

    // Options
    this.elapsed = 0
    this.elapsedSeconds = 0
    this.delta = 16 // how many milliseconds there is between two frames at 60fps
    this.paused = false

    // Setup
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.timer = new Timer()

    // Events
    // don't call the tick method immediately to avoid having a delta equal to 0 on the first frame
    window.requestAnimationFrame(this.tick)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.paused = true
        gsap.globalTimeline.pause()
        this.experience.soundPlayer?.setMuted(true)
      } else {
        this.paused = false
        this.timer.reset()
        gsap.globalTimeline.resume()
        this.experience.soundPlayer?.setMuted(false)
      }
    })
  }

  tick = () => {
    window.requestAnimationFrame(this.tick)

    if (this.paused) return

    this.debug?.stats.begin()
    this.timer.update()

    this.delta = this.timer.getDelta()
    this.elapsed = this.timer.getElapsed()

    this.dispatchEvent({ type: 'tick' })

    const currentSeconds = Math.floor(this.elapsed)
    if (this.elapsedSeconds < currentSeconds) {
      this.dispatchEvent({ type: 'tick-seconds' })
    }
    this.elapsedSeconds = currentSeconds

    this.debug?.stats.end()
  }
}
