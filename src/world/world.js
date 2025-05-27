import Experience from '@experience'
import { MathUtils } from 'three'
import Environment from './environment'
import Gear from './gear'
import Grid from './grid'
import Walls from './walls'

export default class World {
  constructor() {
    this.experience = Experience.instance
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera

    this.environment = new Environment()
    this.grid = new Grid()
    this.walls = new Walls(this.grid)
    this.gears = Array.from({ length: this.grid.height * 2 }, (_, i) => new Gear(this.grid, i))

    // TODO improve this workaround
    this.resize(true)
    this.resize(true)
  }

  async resize(skip) {
    const vertical = this.sizes.aspectRatio < 1

    this.camera.controls.rotateAzimuthTo(vertical ? -90 * MathUtils.DEG2RAD : 0, !skip)
    this.camera.controls.fitToBox(this.grid.tilesGroup, !skip, {
      paddingBottom: vertical ? 1 : 0.2,
      paddingTop: 1,
      paddingLeft: 1,
      paddingRight: 1,
    })
    this.camera.controls.rotatePolarTo(vertical ? 0 : 10 * MathUtils.DEG2RAD, !skip)
  }

  update() {
    this.gears.forEach(g => g.update())
  }
}
