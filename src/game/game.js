import Experience from '@experience'
import Button from '@ui/button'
import Menu from '@ui/menu'
import Overlay from '@ui/overlay'
import Text from '@ui/text'
import formatTimer from '@utils/format'
import { getParticleSystem } from '@utils/getParticleSystem'
import Random from '@utils/random'
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
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera
    this.soundPlayer = this.experience.soundPlayer

    this.grid = new Grid()
    this.walls = new Walls(this)
    this.gears = new Gears(this)
    this.pillars = new Pillars(this)
    this.character = new Character(this)

    this.timer = 0
    this.defaultSpeed = 0.8
    this.minSpeed = 0.1
    this.speedDelta = 0.05
    this.speed = this.defaultSpeed
    this.backSpeed = 0.5

    // TODO improve
    this.retryButton = new Button('#retry')
    this.retryButton.onClick(async () => {
      await PokiSDK.commercialBreak(() => this.soundPlayer.stop('loop'))
      PokiSDK.gameplayStart()

      Overlay.instance.open()
      this.start()
    })

    Menu.instance?.startButton.onClick(async () => {
      PokiSDK.gameplayStart()

      Menu.instance.close()
      this.start()
    })

    this.timerText = new Text('#timer')

    this.setParticles()
    this.init()

    // TODO improve this workaround
    this.resize(true)
    this.resize(true)
  }

  /**
   * TODO: improve -------------------------------------------------------
   * derive quantities from `this.grid` size
   */
  setParticles() {
    this.aliveParticles = []

    this.particles = Array.from({ length: 5 }, (_, i) => {
      const paricles = getParticleSystem({
        camera: this.camera.instance,
        emitter: { position: new Vector3(0, 0.5, i + 0.5 - 2) },
        parent: this.scene,
        rate: 50,
        texture: './particles/smoke.png',
        radius: 0.5,
      })
      return paricles
    })
  }

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

    this.retryButton.hide()
    this.timerText.hide()

    await Promise.all(
      this.state.map((_, i) => this.movePillar(i, [0, 4, 5, 9].includes(i) ? 4 : 3)),
    )

    await this.onCollision([
      { index: 0, shift: 0 },
      { index: 4, shift: 0 },
    ])
    await this.sleep()

    this.timer = 0
    this.timerText.set(formatTimer(this.timer))
    return this.loop()
  }

  async stop() {
    if (!this.started) return
    this.started = false

    PokiSDK.gameplayStop()

    this.speed = this.defaultSpeed
    this.character.die()
    Overlay.instance.close()
    await this.reset()
    this.soundPlayer.stop('pillars')
    this.soundPlayer.stop('cogs')
    this.retryButton.show('top')
  }

  reset() {
    return Promise.all(
      this.state.map((_, i) => this.movePillar(i, [0, 4, 5, 9].includes(i) ? 2 : 1)),
    )
  }

  sleep(seconds = 1) {
    this.soundPlayer.stop('pillars')
    this.soundPlayer.stop('cogs')
    return new Promise(resolve => setTimeout(() => resolve(), seconds * 1000))
  }

  async loop() {
    this.soundPlayer.play('loop')
    this.timerText.show('bottom')

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

    // lerp
    const t = (this.speed - this.minSpeed) / (this.defaultSpeed - this.minSpeed)
    const value = 1 + t * (4 - 1)
    const count = Math.round(value)

    const safeSpots = new Set()
    while (safeSpots.size < count) {
      const row = Random.integer({ max: 4 })
      if (!safeSpots.has(row)) safeSpots.add(row)
    }

    const collisions = []
    await Promise.all(
      Array.from({ length: 5 }, (_, i) => {
        const isSafe = safeSpots.has(i)
        const combination = Random.oneOf(isSafe ? safeCombinations : unsafeCombinations)

        if (!isSafe) {
          collisions.push({
            index: i,
            shift: combination.at(0) === 3 ? 1 : combination.at(0) === 1 ? -1 : 0,
          })
        }

        return [this.movePillar(i, combination.at(0)), this.movePillar(i + 5, combination.at(1))]
      }).flat(),
    )

    this.started = true
    this.character.enabled = true

    await this.sleep(0.2 * count)
    await Promise.all(this.state.map((s, i) => this.movePillar(i, s.step + 2)))
    await this.onCollision(collisions)
    await this.sleep(2)

    return this.started && this.loop()
  }

  async onCollision(collisions) {
    this.soundPlayer.stop('pillars')
    this.soundPlayer.stop('cogs')

    this.soundPlayer.play('collision', { loop: false })

    collisions.forEach(c => {
      const particles = this.particles.at(c.index)
      particles.points.position.x = c.shift
      this.aliveParticles.push(c.index)
    })

    await this.camera.tilt()

    this.aliveParticles = []
  }
  // ---------------------------------------------------------------------

  movePillar(index, step) {
    const state = this.state.at(index)
    const directionIn = state.step - step < 0
    const speed = directionIn ? this.speed : this.backSpeed

    this.soundPlayer.play('pillars', { speed: 0.5 })
    this.soundPlayer.play('cogs', { volume: 0.1 })

    return gsap.to(state, {
      step,
      minX: this.getMinX(index, step),
      maxX: this.getMaxX(index, step),
      ease: 'none',
      duration: Math.abs(state.step - step) * speed,
      onUpdate: () => {
        this.pillars.setPositionX(index, state.step)
        this.gears.setRotation(index, speed, directionIn)
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
    this.particles.forEach((p, i) => p.update(this.time.delta, !this.aliveParticles.includes(i)))
  }

  updateSeconds() {
    if (!this.started) return
    this.timer++
    this.timerText.set(formatTimer(this.timer))
  }
}
