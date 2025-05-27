import Experience from '@experience'
import { InstancedMesh2 } from '@three.ez/instanced-mesh'
import Random from '@utils/random'
import { MathUtils } from 'three'

export default class Gears {
  static base
  static iMesh

  constructor(grid) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.grid = grid

    this.initBase()
    this.init()
  }

  initBase() {
    this.resources.items.gear.scene.traverse(child => {
      if (child.name === 'Gear000_Material_0') this.base = child
    })
  }

  init() {
    this.iMesh = new InstancedMesh2(this.base.geometry, this.base.material, {
      allowsEuler: true,
      createEntities: true,
    })
    this.scene.add(this.iMesh)

    this.iMesh.addInstances(this.grid.height * 2, (obj, index) => {
      obj.position.x = index < this.grid.height ? this.grid.minX : this.grid.maxX
      obj.position.y = 2
      obj.position.z = this.grid.minZ + 0.35 + (index % this.grid.height)

      obj.scale.set(0.7, 3.8, 0.7)

      obj.rotation.x = 90 * MathUtils.DEG2RAD
      obj.rotation.y = Random.float({ max: 10 })
    })
  }

  update() {
    this.iMesh.instances.forEach((obj, index) => {
      const direction = index < this.grid.height ? 1 : -1
      obj.rotation.y += 0.01 * direction
      obj.updateMatrix()
    })
  }
}
