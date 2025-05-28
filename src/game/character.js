import Experience from '@experience'
import { AnimationMixer } from 'three'

export default class Character {
  constructor() {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.moveSpeed = 0.01

    // mesh
    this.mesh = this.resources.items.character.scene

    this.mesh.scale.setScalar(0.6)
    this.mesh.position.y = 0.05

    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.material.metalness = 0
        child.material.roughess = 1
      }
    })
    this.scene.add(this.mesh)

    // animations
    console.log(this.resources.items.character.animations.map(a => a.name))
    this.idleAnimation = this.resources.items.character.animations.at(23)

    this.animationMixer = new AnimationMixer(this.mesh)
    this.idleAction = this.animationMixer.clipAction(this.idleAnimation)
    this.idleAction.play()

    this.setDebug()
  }

  setDebug() {
    if (!this.debug) return

    const folder = this.debug.root.addFolder({ title: '🕹️ character', expanded: false })
    folder.addBinding(this.mesh, 'position')
  }

  update() {
    this.animationMixer?.update(this.time.delta)
  }

  moveLeft() {
    this.mesh.position.x -= this.moveSpeed
  }
  moveRight() {
    this.mesh.position.x += this.moveSpeed
  }
  moveUp() {
    this.mesh.position.z -= this.moveSpeed
  }
  moveDown() {
    this.mesh.position.z += this.moveSpeed
  }
}
