import Experience from '@experience'
import gsap from 'gsap'
import { MathUtils, Vector3 } from 'three'
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
    this.walls = new Walls(this)
    this.gears = new Gears(this)
    this.pillars = new Pillars(this)
    this.character = new Character(this)

    this.init()
    this.start()

    // TODO improve this workaround
    this.resize(true)
    this.resize(true)
  }

  init() {
    this.state = Array.from({ length: this.pillars.count }, (_, index) => {
      return {
        step: 1,
        minX: this.getMinX(index, 1),
        maxX: this.getMaxX(index, 1),
        minZ: this.grid.minZ + (index % this.grid.height),
        maxZ: this.grid.minZ + (index % this.grid.height) + 1,
      }
    })
  }

  // TODO: improve, game loop?
  start() {
    const outerPillars = [0, 4, 5, 9]
    const innerPillars = [1, 2, 3, 6, 7, 8]

    const animation = () => {
      innerPillars.map(i => this.movePillar(i, 3))

      Promise.all(outerPillars.map(i => this.movePillar(i, 4)))
        .then(() => this.camera.tilt())
        .then(() => Promise.all(outerPillars.concat(innerPillars).map(i => this.movePillar(i, 1))))
        .then(animation)
    }

    animation()
  }

  movePillar(index, step) {
    const state = this.state.at(index)
    const directionIn = state.step - step < 0
    const speed = 0.8

    return gsap.to(state, {
      step,
      minX: this.getMinX(index, step),
      maxX: this.getMaxX(index, step),
      ease: 'none',
      duration: Math.abs(state.step - step) * (directionIn ? speed : 0.5),
      onUpdate: () => {
        this.pillars.setPositionX(index, state.step)
        this.gears.setRotation(index, directionIn)
      },
    })
  }

  getMinX(index, step) {
    const offset = 0.25
    const onLeft = index < this.grid.height
    const initial = onLeft ? this.grid.minX + 1 : 0

    return onLeft ? initial + (step - 1) + offset : initial
  }

  getMaxX(index, step) {
    const offset = 0.25
    const onLeft = index < this.grid.height
    const initial = onLeft ? 0 : this.grid.maxX - 1

    return onLeft ? initial : initial - (step - 1) - offset
  }

  checkPosition(position) {
    // TODO: offset on z collision
    const { x, z } = position
    const target = this.state.filter(s => z <= s.maxZ && z >= s.minZ).at(x > 0 ? 1 : 0)
    return target && x >= target.minX && x <= target.maxX && z >= target.minZ && z <= target.maxZ
  }

  pushPosition(position) {
    const { x, z } = position

    const target = this.state.filter(s => z <= s.maxZ && z >= s.minZ).at(x > 0 ? 1 : 0)
    const edgeX = target.minX ? target.minX : target.maxX

    if (Math.abs(x - edgeX >= 0.4)) {
      position.copy(new Vector3())
      alert('GAME OVER')
    }

    position.x = edgeX
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

  update() {
    this.character.update()
  }
}
