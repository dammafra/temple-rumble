export default class Loading {
  /** @type {Loading} */
  static instance

  static init() {
    return new Loading()
  }

  constructor() {
    if (Loading.instance) return Loading.instance
    Loading.instance = this

    this.start()
  }

  start() {}

  stop() {
    this.dispose()
  }

  setProgress(progress) {
    console.log('Loading...', progress)
  }

  dispose() {}
}
