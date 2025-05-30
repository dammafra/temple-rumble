import Game from '@game/game'
import { AxesHelper, GridHelper, Scene } from 'three'
import Camera from './camera'
import Environment from './environment'
import Renderer from './renderer'
import Resources from './resources'
import Sizes from './sizes'
import SoundPlayer from './sound-player'
import Time from './time'

export default class Experience {
  /** @type {Experience} */
  static instance

  static async init(canvasSelector, loading, debug) {
    return new Experience(document.querySelector(canvasSelector), loading, await debug)
  }

  constructor(canvas, loading, debug) {
    if (Experience.instance) return Experience.instance
    Experience.instance = this

    // Options
    this.canvas = canvas
    this.loading = loading
    this.debug = debug

    // Setup
    this.time = new Time()
    this.sizes = new Sizes()
    this.resources = new Resources(loading)
    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.ready)
    this.resources.startLoading()

    this.setDebug()
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
    this.game?.resize()
  }

  ready = () => {
    this.loading.stop()

    this.environment = new Environment()
    this.soundPlayer = new SoundPlayer()
    this.game = new Game()
  }

  update = () => {
    this.camera.update()
    this.renderer.update()
    this.environment?.update()
    this.game?.update()
  }

  updateSeconds = () => {
    this.game?.updateSeconds()
  }

  dispose() {}

  setDebug() {
    if (!this.debug) return

    window.experience = Experience.instance

    const helpersSize = 20
    const axesHelper = new AxesHelper(helpersSize)
    axesHelper.visible = false
    axesHelper.position.x = -helpersSize * 0.5
    axesHelper.position.y = 0.02
    axesHelper.position.z = -helpersSize * 0.5

    const gridHelper = new GridHelper(helpersSize, helpersSize, 'red', 'white')
    gridHelper.position.y = 0.01
    gridHelper.visible = false

    this.scene.add(axesHelper, gridHelper)

    this.debug.root
      .addBinding(axesHelper, 'visible', { label: 'helpers', index: 3 })
      .on('change', event => {
        axesHelper.visible = event.value
        gridHelper.visible = event.value
      })
  }
}
