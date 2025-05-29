import Element from './element'

export default class Button extends Element {
  constructor(selector) {
    super(selector)
  }

  onClick(callback) {
    this.element.addEventListener('click', async () => {
      this.disable()
      this.element.blur()
      callback()
    })

    return this
  }
}
