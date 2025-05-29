import Experience from '@experience'
import Button from '@ui/button'
import Menu from '@ui/menu'
import Overlay from '@ui/overlay'
import Text from '@ui/text'
import Random from '@utils/random'
import gsap from 'gsap'
import { MathUtils } from 'three'
import Character from './character'
import Gears from './gears'
import Grid from './grid'
import Pillars from './pillars'
import Walls from './walls'

export default class Game {
  get formattedTime() {
    const minutes = Math.floor(this.time / 60)
    const secs = this.time % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

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

    this.time = 0
    this.defaultSpeed = 1
    this.minSpeed = 0.2
    this.speedDelta = 0.05
    this.speed = this.defaultSpeed
    this.backSpeed = 0.6

    // TODO improve
    this.restartButton = new Button('#restart')
    this.restartButton.onClick(() => {
      Overlay.instance.open()
      this.start()
    })

    Menu.instance.startButton.onClick(() => {
      Menu.instance.close()
      this.start()
    })

    this.timerText = new Text('#timer')

    this.init()

    // TODO improve this workaround
    this.resize(true)
    this.resize(true)
  }

  /**
   * TODO: improve -------------------------------------------------------
   * derive quantities from `this.grid` size
   */
  init() {
    this.state = Array.from({ length: this.pillars.count }, (_, index) => {
      return {
        step: [0, 4, 5, 9].includes(index) ? 2 : 1,
        minX: this.getMinX(index, 1),
        maxX: this.getMaxX(index, 1),
        minZ: this.grid.minZ + (index % this.grid.height),
        maxZ: this.grid.minZ + (index % this.grid.height) + 1,
      }
    })
  }

  async start() {
    this.character.reset()

    this.restartButton.hide()
    this.timerText.hide()

    await Promise.all(
      this.state.map((_, i) => this.movePillar(i, [0, 4, 5, 9].includes(i) ? 4 : 3)),
    )

    await this.camera.tilt()
    await this.sleep()

    this.timerText.set(this.formattedTime)
    return this.loop()
  }

  async stop() {
    this.started = false
    this.time = 0
    this.speed = this.defaultSpeed
    this.character.die()
    Overlay.instance.close()
    await this.reset()
    this.restartButton.show('top')
  }

  reset() {
    return Promise.all(
      this.state.map((_, i) => this.movePillar(i, [0, 4, 5, 9].includes(i) ? 2 : 1)),
    )
  }

  sleep(seconds = 1) {
    return new Promise(resolve => setTimeout(() => resolve(), seconds * 1000))
  }

  async loop() {
    const safeCombinations = [
      [1, 2],
      [2, 1],
    ]

    const unsafeCombinations = [
      [1, 3],
      [3, 1],
      [2, 2],
    ]

    this.speed = Math.max(this.minSpeed, this.speed - this.speedDelta)

    const safeSpots = new Set()
    while (safeSpots.size < Random.integer({ min: 2, max: 4 })) {
      const row = Random.integer({ max: 4 })
      if (!safeSpots.has(row)) safeSpots.add(row)
    }

    await Promise.all(
      Array.from({ length: 5 }, (_, i) => {
        const isSafe = safeSpots.has(i)
        const combination = Random.oneOf(isSafe ? safeCombinations : unsafeCombinations)
        return [this.movePillar(i, combination.at(0)), this.movePillar(i + 5, combination.at(1))]
      }).flat(),
    )

    this.started = true
    this.character.enabled = true
    this.timerText.show('bottom')

    await this.sleep()
    await Promise.all(this.state.map((s, i) => this.movePillar(i, s.step + 2)))
    await this.camera.tilt()
    await this.sleep(2)

    return this.started && this.loop()
  }
  // ---------------------------------------------------------------------

  movePillar(index, step) {
    const state = this.state.at(index)
    const directionIn = state.step - step < 0

    return gsap.to(state, {
      step,
      minX: this.getMinX(index, step),
      maxX: this.getMaxX(index, step),
      ease: 'none',
      duration: Math.abs(state.step - step) * (directionIn ? this.speed : this.backSpeed),
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
    const [target1, target2] = this.state.filter(s => z <= s.maxZ && z >= s.minZ)
    const target = {
      minX: target1.minX,
      maxX: target2.maxX,
      minZ: target1.minZ,
      maxZ: target1.maxZ,
    }

    return x >= target.minX && x <= target.maxX && z >= target.minZ && z <= target.maxZ
  }

  pushPosition(position) {
    const { x, z } = position

    const [target1, target2] = this.state.filter(s => z <= s.maxZ && z >= s.minZ)
    const target = {
      minX: target1.minX,
      maxX: target2.maxX,
      minZ: target1.minZ,
      maxZ: target1.maxZ,
    }

    const edgeX = x > target.maxX ? target.maxX : target.minX
    position.x = edgeX

    if (Math.abs(x - edgeX >= 0.4)) this.stop()
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

  updateSeconds() {
    if (!this.started) return
    this.timerText.set(this.formattedTime)
    this.time++
  }
}
