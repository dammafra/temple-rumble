import Experience from '@experience'

export default class Gears {
  constructor() {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.resources.items.gear.scene.traverse(child => {
      if (child.name === 'Gear000_Material_0') this.base = child
    })

    this.base.rotation.x = Math.PI * 0.5
    this.base.scale.set(0.8, 5, 0.8)
    this.base.position.y = 2

    this.instances = Array.from({ length: 10 }, () => this.base.clone())
    this.instances.forEach((gear, index) => {
      gear.position.x = index < 5 ? -4 : 4
      gear.position.z = -1.8 + (index % 5)
      this.scene.add(gear)
      // gsap.to(gear.rotation, { y: Math.PI, repeat: -1, ease: 'none', duration: 2 })
    })
  }
}
