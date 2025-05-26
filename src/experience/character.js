import Experience from '@experience'
import { AnimationMixer, Color } from 'three'

export default class Character {
  constructor() {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    // mesh
    this.color = '#ffffff'
    this.mesh = this.resources.items.character.scene
    this.mesh.scale.setScalar(0.4)
    this.mesh.position.y = 0.05
    this.mesh.traverse(child => {
      if (child.isSkinnedMesh && child.name === 'Player_1') {
        this.skin = child
      }
    })

    this.scene.add(this.mesh)

    // animations
    this.jumpAnimation = this.resources.items.character.animations.at(0)
    this.walkAnimation = this.resources.items.character.animations.at(1)

    this.animationMixer = new AnimationMixer(this.mesh)
    this.walkAction = this.animationMixer.clipAction(this.walkAnimation)
    this.jumpAction = this.animationMixer.clipAction(this.jumpAnimation)
    this.walkAction.play()

    this.setDebug()
  }

  setDebug() {
    if (!this.debug) return

    const folder = this.debug.root.addFolder({ title: '🕹️ character', expanded: false })
    folder
      .addBinding(this, 'color')
      .on('change', event => (this.skin.material.color = new Color(event.value)))
    folder.addBinding(this.mesh, 'position')
  }

  update() {
    this.animationMixer?.update(this.time.delta)
  }
}
