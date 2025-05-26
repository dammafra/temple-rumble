import Experience from '@experience'
import Random from '@utils/random'

export default class Gear {
  static base

  constructor(grid, index) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.grid = grid
    this.index = index

    if (!Gear.base) this.initBase()
    this.setMesh(index)
  }

  initBase() {
    this.resources.items.gear.scene.traverse(child => {
      if (child.name === 'Gear000_Material_0') Gear.base = child
    })

    Gear.base.rotation.x = Math.PI * 0.5
    Gear.base.scale.set(0.7, 3.8, 0.7)
    Gear.base.position.y = 2
  }

  setMesh() {
    this.mesh = Gear.base.clone()
    this.mesh.position.x =
      this.index < this.grid.height
        ? -Math.floor(this.grid.width / 2)
        : Math.ceil(this.grid.width / 2)
    this.mesh.position.z = -1.6 + (this.index % this.grid.height)
    this.mesh.rotation.y = Random.float({ max: 10 })
    this.scene.add(this.mesh)
  }

  update() {
    const direction = this.index < this.grid.height ? 1 : -1
    this.mesh.rotation.y += 0.01 * direction
  }
}
