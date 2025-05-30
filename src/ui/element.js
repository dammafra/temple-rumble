import gsap from 'gsap'

export default class Element {
  get disabled() {
    return this.element.style.pointerEvents === 'none'
  }

  constructor(selector) {
    this.element = document.querySelector(selector)

    gsap.set(this.element, { opacity: 0 })
    this.element.setAttribute('tabindex', '-1')
    this.element.classList.add('hidden')
  }

  show(direction) {
    if (this.visible) return
    this.visible = true

    this.enable()
    this.animation?.kill()

    this.key = direction === 'left' || direction === 'right' ? 'xPercent' : 'yPercent'
    this.sign = direction === 'left' || direction === 'top' ? 1 : -1

    gsap.set(this.element, { [this.key]: 30 * this.sign })
    this.element.classList.remove('hidden')

    this.animation = gsap
      .timeline()
      .to(this.element, {
        opacity: 1,
        duration: 1,
      })
      .to(
        this.element,
        {
          [this.key]: 0,
          ease: 'bounce.out',
          duration: 1,
        },
        '<',
      )

    return this
  }

  hide() {
    if (!this.visible) return
    this.visible = false

    this.animation?.kill()

    this.animation = gsap.to(this.element, {
      opacity: 0,
      [this.key]: 30 * this.sign,
      duration: 1,
      ease: 'back.out',
      onComplete: () => this.element.classList.add('hidden'),
    })

    return this
  }

  disable() {
    this.element.style.pointerEvents = 'none'
    return this
  }

  enable() {
    this.element.style.pointerEvents = 'auto'
    return this
  }
}
