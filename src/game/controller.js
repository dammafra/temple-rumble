import Experience from '@experience'
import Touch from '@utils/touch'
import kd from 'keydrown'
import nipplejs from 'nipplejs'
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

    this.setGamepad()
  }

  setGamepad() {
    if (!Touch.support) return

    const container = document.createElement('div')
    container.classList.add('nipplejs-container')
    document.body.append(container)

    const joystick = nipplejs.create({
      zone: container,
      mode: 'dynamic',
      size: 120,
    })

    joystick.on('move', (_, data) => {
      const direction = new Vector2(data.vector.x, -data.vector.y)
      this.character.setMovement(true, this.normalizeDirection(direction))
    })

    joystick.on('end', () => {
      this.character.setMovement(false)
    })
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

    this.character.setMovement(this.activeKeys.size > 0, this.normalizeDirection(direction))
  }

  normalizeDirection(direction) {
    direction.normalize()

    if (this.sizes.isPortrait) {
      const temp = direction.x
      direction.x = -direction.y
      direction.y = temp
    }

    return direction
  }

  update() {
    kd.tick()
  }
}
