import Experience from '@experience'
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  NeutralToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
  WebGLRenderer,
} from 'three'

export default class Renderer {
  constructor() {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.setInstance()
    this.setDebug()
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      alpha: true,
      canvas: this.canvas,
      antialias: this.sizes.pixelRatio <= 2,
    })

    this.instance.shadowMap.enabled = true
    this.instance.setClearColor('#222222')
    this.instance.toneMapping = CineonToneMapping
    this.maxAnisotropy = Math.min(2, this.instance.capabilities.getMaxAnisotropy())

    this.resize()
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }

  setDebug() {
    if (!this.debug) return

    this.debug.root.addBinding(this.instance, 'toneMapping', {
      label: 'tone mapping',
      index: 3,
      options: [
        { text: 'NoToneMapping', value: NoToneMapping },
        { text: 'CineonToneMapping', value: CineonToneMapping },
        { text: 'LinearToneMapping', value: LinearToneMapping },
        { text: 'NeutralToneMapping', value: NeutralToneMapping },
        { text: 'ReinhardToneMapping', value: ReinhardToneMapping },
        { text: 'ACESFilmicToneMapping', value: ACESFilmicToneMapping },
      ],
    })
  }
}
