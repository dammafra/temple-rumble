import gsap from 'gsap'

export default class Overlay {
  /** @type {Overlay} */
  static instance

  static init() {
    return new Overlay()
  }

  constructor() {
    if (Overlay.instance) return Overlay.instance
    Overlay.instance = this

    this.element = document.querySelector('.overlay')
    const [pillarLeft, pillarRight] = this.element.querySelectorAll('.pillar')

    this.pillarLeft = pillarLeft
    this.pillarRight = pillarRight

    gsap.set(this.pillarLeft, { xPercent: -50 })
    gsap.set(this.pillarRight, { xPercent: 50 })
  }

  openAt(percent) {
    gsap.to(this.pillarLeft, {
      xPercent: -50 - percent * 0.5,
      duration: 2,
      ease: 'back.out',
    })

    return gsap.to(this.pillarRight, {
      xPercent: 50 + percent * 0.5,
      duration: 2,
      ease: 'back.out',
    })
  }

  open() {
    gsap.to(this.pillarLeft, { xPercent: -100, duration: 2, ease: 'back.out' })
    return gsap.to(this.pillarRight, { xPercent: 100, duration: 2, ease: 'back.out' })
  }

  close() {
    gsap.to(this.pillarLeft, { xPercent: -50, duration: 2, ease: 'bounce.out' })
    return gsap.to(this.pillarRight, { xPercent: 50, duration: 2, ease: 'bounce.out' })
  }

  dispose() {
    this.element.remove()
  }
}
