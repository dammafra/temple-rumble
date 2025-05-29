import Experience from '@experience'
import { AnimationMixer, LoopOnce, Vector2, Vector3 } from 'three'
import Controller from './controller'

export default class Character {
  constructor(game) {
    this.experience = Experience.instance
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.enabled = false
    this.game = game
    this.grid = game.grid
    this.controller = new Controller(this)

    this.isMoving = false
    this.moveSpeed = 3.5
    this.rotationSpeed = 15
    this.direction = new Vector2()

    this.setMesh()
    this.setAnimations()
  }

  setMesh() {
    this.mesh = this.resources.items.character.scene

    this.defaultPosition = new Vector3(0, 0.05, 0.5)
    this.mesh.position.copy(this.defaultPosition)

    this.mesh.scale.setScalar(0.6)

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
    const deathIndex = animations.findIndex(a => a.name.toLowerCase().includes('death'))

    this.idleAnimation = animations[idleIndex]
    this.runAnimation = animations[runIndex]
    this.deathAnimation = animations[deathIndex]

    this.animationMixer = new AnimationMixer(this.mesh)

    this.idleAction = this.animationMixer.clipAction(this.idleAnimation)
    this.idleAction.play()

    this.runAction = this.animationMixer.clipAction(this.runAnimation)
    this.runAction.play()
    this.runAction.enabled = false

    this.deathAction = this.animationMixer.clipAction(this.deathAnimation)
    this.deathAction.setLoop(LoopOnce)
    this.deathAction.clampWhenFinished = true
  }

  setMovement(isMoving = false, direction = new Vector2()) {
    if (!this.enabled) return

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

  move() {
    if (!this.isMoving || !this.enabled) return

    const newX = this.mesh.position.x + this.direction.x * this.moveSpeed * this.time.delta
    const newZ = this.mesh.position.z + this.direction.y * this.moveSpeed * this.time.delta
    const newPosition = new Vector3(newX, this.mesh.position.y, newZ)

    if (this.grid.contains(newPosition) && this.game.checkPosition(newPosition)) {
      this.mesh.position.copy(newPosition)
    }

    const currentAngle = this.mesh.rotation.y
    const targetAngle = Math.atan2(this.direction.x, this.direction.y)

    let angleDiff = targetAngle - currentAngle
    angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI

    this.mesh.rotation.y = currentAngle + angleDiff * this.time.delta * this.rotationSpeed
  }

  reset() {
    this.enabled = false
    this.mesh.position.copy(this.defaultPosition)
    this.mesh.rotation.set(0, 0, 0)

    this.deathAction.stop()
    this.idleAction.play()
    this.runAction.play()
    this.runAction.enabled = false
  }

  die() {
    this.enabled = false

    this.deathAction.play()
    this.idleAction.stop()
    this.runAction.stop()
  }

  update() {
    this.controller.update()
    this.animationMixer?.update(this.time.delta)

    if (!this.game.checkPosition(this.mesh.position)) {
      this.game.pushPosition(this.mesh.position)
    }

    this.move()
  }
}
