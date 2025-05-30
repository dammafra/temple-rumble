import Element from './element'

export default class Input extends Element {
  constructor(id) {
    super(id)
  }

  set(value) {
    this.element.value = value
    return this
  }

  get() {
    return this.element.value
  }

  hide() {
    this.reset()
    super.hide()
  }

  reset() {
    this.element.value = ''
    return this
  }
}
