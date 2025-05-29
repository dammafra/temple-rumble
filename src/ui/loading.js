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
    this.progress = this.element.querySelector('.progress')

    this.start()
  }

  start() {}

  stop() {
    this.dispose()
  }

  setProgress(progress) {
    this.progress.textContent = `${progress}%`
  }

  dispose() {
    this.element.remove()
  }
}
