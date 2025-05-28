import Experience from '@experience'
import kd from 'keydrown'
import { Vector2 } from 'three'

export default class Controller {
  constructor(character) {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes
    this.character = character

    this.activeKeys = new Set()

    kd.UP.down(this.onArrowUp.bind(this))
    kd.RIGHT.down(this.onArrowRight.bind(this))
    kd.DOWN.down(this.onArrowDown.bind(this))
    kd.LEFT.down(this.onArrowLeft.bind(this))

    kd.UP.up(() => this.onKeyUp('UP'))
    kd.RIGHT.up(() => this.onKeyUp('RIGHT'))
    kd.DOWN.up(() => this.onKeyUp('DOWN'))
    kd.LEFT.up(() => this.onKeyUp('LEFT'))
  }

  onArrowUp() {
    this.activeKeys.add('UP')
    this.updateDirection()
  }

  onArrowRight() {
    this.activeKeys.add('RIGHT')
    this.updateDirection()
  }

  onArrowDown() {
    this.activeKeys.add('DOWN')
    this.updateDirection()
  }

  onArrowLeft() {
    this.activeKeys.add('LEFT')
    this.updateDirection()
  }

  onKeyUp(key) {
    this.activeKeys.delete(key)
    this.updateDirection()
  }

  updateDirection() {
    const direction = new Vector2()

    if (this.activeKeys.has('UP')) direction.y -= 1
    if (this.activeKeys.has('DOWN')) direction.y += 1
    if (this.activeKeys.has('LEFT')) direction.x -= 1
    if (this.activeKeys.has('RIGHT')) direction.x += 1

    direction.normalize()

    // Apply portrait mode transformation if needed
    if (this.sizes.isPortrait) {
      const temp = direction.x
      direction.x = -direction.y
      direction.y = temp
    }

    this.character.setMovement(this.activeKeys.size > 0, direction)
  }

  update() {
    kd.tick()
  }
}
