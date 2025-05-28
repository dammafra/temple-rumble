import Experience from '@experience'
import { AnimationMixer, Vector2 } from 'three'

export default class Character {
  constructor(grid) {
    this.experience = Experience.instance
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.grid = grid

    this.isMoving = false
    this.moveSpeed = 3
    this.rotationSpeed = 10
    this.direction = new Vector2()

    this.setMesh()
    this.setAnimations()
  }

  setMesh() {
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
  }

  setAnimations() {
    const animations = this.resources.items.character.animations
    // console.log('available animations:', animations.map(a => a.name))

    const idleIndex = animations.findIndex(a => a.name.toLowerCase().includes('idle'))
    const runIndex = animations.findIndex(a => a.name.toLowerCase().includes('run'))

    this.idleAnimation = animations[idleIndex]
    this.runAnimation = animations[runIndex]

    this.animationMixer = new AnimationMixer(this.mesh)

    this.idleAction = this.animationMixer.clipAction(this.idleAnimation)
    this.idleAction.play()

    this.runAction = this.animationMixer.clipAction(this.runAnimation)
    this.runAction.play()
    this.runAction.enabled = false
  }

  setMovement(isMoving = false, direction = new Vector2()) {
    this.direction.copy(direction)

    if (this.isMoving === isMoving) return
    this.isMoving = isMoving

    if (isMoving) {
      this.runAction.reset()
      this.idleAction.crossFadeTo(this.runAction, 0.3, false)
    } else {
      this.idleAction.reset()
      this.runAction.crossFadeTo(this.idleAction, 0.3, false)
    }
  }

  update() {
    this.animationMixer?.update(this.time.delta)

    if (!this.isMoving) return

    const newX = this.mesh.position.x + this.direction.x * this.moveSpeed * this.time.delta
    const newZ = this.mesh.position.z + this.direction.y * this.moveSpeed * this.time.delta

    if (this.grid.contains(newX, newZ)) {
      this.mesh.position.x = newX
      this.mesh.position.z = newZ
    }

    const currentAngle = this.mesh.rotation.y
    const targetAngle = Math.atan2(this.direction.x, this.direction.y)

    let angleDiff = targetAngle - currentAngle
    angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI

    this.mesh.rotation.y = currentAngle + angleDiff * this.time.delta * this.rotationSpeed
  }
}
