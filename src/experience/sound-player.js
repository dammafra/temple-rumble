import Experience from '@experience'

export default class SoundPlayer {
  constructor() {
    this.experience = Experience.instance
    this.resources = this.experience.resources

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.sources = new Map()
    this.muted = false

    /**
     * This code helps resume audioContext when the tab is suspended (e.g., when switching apps or locking the phone) and later resumed,
     * especially on mobile where browsers often suspend audio contexts to save resources;
     * by listening to user interactions (touchstart, touchend, mousedown, keydown), it ensures audio resumes reliably after the tab becomes active again.
     */
    ;['touchstart', 'touchend', 'mousedown', 'keydown'].forEach(e =>
      document.body.addEventListener(e, () => this.audioContext.resume(), false),
    )
  }

  setMuted(value) {
    this.muted = value

    for (const { gainNode, volume } of this.sources.values()) {
      gainNode.gain.value = value ? 0 : volume
    }
  }

  async play(sound, { loop = true, volume = 0.5, speed = 1 } = {}) {
    const buffer = this.resources.items[sound]

    if (!buffer || this.sources.get(sound)) return

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.playbackRate.value = speed

    const gainNode = this.audioContext.createGain()
    gainNode.gain.value = this.muted ? 0 : volume

    source.connect(gainNode).connect(this.audioContext.destination)
    source.start()

    loop && this.sources.set(sound, { source, gainNode, volume })
  }

  async stop(sound) {
    this.sources.get(sound)?.source.stop()
    this.sources.delete(sound)
  }
}
