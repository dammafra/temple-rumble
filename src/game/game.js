import Experience from '@experience'
import gsap from 'gsap'
import { MathUtils } from 'three'
import Character from './character'
import Gears from './gears'
import Grid from './grid'
import Pillars from './pillars'
import Walls from './walls'

export default class Game {
  constructor() {
    this.experience = Experience.instance
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera

    this.grid = new Grid()
    this.walls = new Walls(this.grid)
    this.gears = new Gears(this.grid)
    this.pillars = new Pillars(this.grid)
    this.character = new Character()

    const outerPillars = [0, 4, 5, 9]
    const innerPillars = [1, 2, 3, 6, 7, 8]
    this.state = Array.from({ length: this.pillars.count }, (_, i) => ({
      step: outerPillars.includes(i) ? 2 : 1,
    }))

    // TODO improve this workaround
    this.resize(true)
    this.resize(true)

    innerPillars.map(i => this.movePillar(i, 3))
    outerPillars
      .map(i => this.movePillar(i, 4))
      .at(0)
      .then(() => this.camera.tilt())
      .then(() => outerPillars.concat(innerPillars).forEach(i => this.movePillar(i, 1)))
  }

  resize(skip) {
    this.camera.controls.rotateAzimuthTo(this.sizes.isPortrait ? -90 * MathUtils.DEG2RAD : 0, !skip)
    this.camera.controls.fitToBox(this.grid.iMesh, !skip, {
      cover: true,
      paddingBottom: this.sizes.isPortrait ? 1 : 0.2,
      paddingTop: 1,
      paddingLeft: 1,
      paddingRight: 1,
    })
    this.camera.controls.rotatePolarTo(this.sizes.isPortrait ? 0 : 20 * MathUtils.DEG2RAD, !skip)
  }

  movePillar(index, step) {
    const state = this.state.at(index)
    const directionIn = state.step - step < 0
    const speed = 0.8

    return gsap.to(state, {
      step,
      ease: 'none',
      duration: Math.abs(state.step - step) * (directionIn ? speed : 0.5),
      onUpdate: () => {
        this.pillars.setPositionX(index, state.step)
        this.gears.setRotation(index, directionIn)
      },
    })
  }

  update() {
    this.character.update()
  }
}
