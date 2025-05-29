import Menu from './menu'
import Text from './text'

export default class Loading {
  /** @type {Loading} */
  static instance

  static init() {
    return new Loading()
  }

  constructor() {
    if (Loading.instance) return Loading.instance
    Loading.instance = this

    this.element = document.querySelector('.loading')
    this.progress = new Text('.progress')

    this.start()
  }

  start() {
    this.progress.show('top')
  }

  stop() {
    this.dispose()
  }

  setProgress(progress) {
    this.progress.set(`${Math.round(progress)}%`)
  }

  dispose() {
    this.element.remove()
    Menu.instance.open()
  }
}
