import Experience from '@experience'
import kd from 'keydrown'

export default class Controller {
  constructor(character) {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes
    this.character = character

    this.resize()
  }

  resize() {
    if (this.sizes.isPortrait) {
      kd.UP.down(() => this.character.moveRight())
      kd.RIGHT.down(() => this.character.moveDown())
      kd.DOWN.down(() => this.character.moveLeft())
      kd.LEFT.down(() => this.character.moveUp())
    } else {
      kd.UP.down(() => this.character.moveUp())
      kd.RIGHT.down(() => this.character.moveRight())
      kd.DOWN.down(() => this.character.moveDown())
      kd.LEFT.down(() => this.character.moveLeft())
    }
  }

  update() {
    kd.tick()
  }
}
