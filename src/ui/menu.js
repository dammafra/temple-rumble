import Button from './button'
import Overlay from './overlay'
import Text from './text'

export default class Menu {
  /** @type {Menu} */
  static instance

  static init() {
    return new Menu()
  }

  constructor() {
    if (Menu.instance) return Menu.instance
    Menu.instance = this

    this.element = document.querySelector('.menu')

    this.menuTextLeft = new Text('.title:nth-child(1)')
    this.menuTextRight = new Text('.title:nth-child(2)')
    this.startButton = new Button('#start')
    this.creditsButton = new Button('#credits')
  }

  open() {
    const aspectRatio = window.innerWidth / window.innerHeight
    this.menuTextLeft.show(aspectRatio < 1 ? 'bottom' : 'right')
    this.menuTextRight.show(aspectRatio < 1 ? 'bottom' : 'left')
    this.startButton.show(aspectRatio < 1 ? 'top' : 'right')
    this.creditsButton.show(aspectRatio < 1 ? 'top' : 'left')

    return Overlay.instance.close()
  }

  close() {
    this.startButton.disable()
    this.creditsButton.disable()

    this.menuTextLeft.hide()
    this.menuTextRight.hide()
    this.startButton.hide()
    this.creditsButton.hide()

    return Overlay.instance.open()
  }
}
