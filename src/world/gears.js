import Experience from '@experience'
import { InstancedMesh2 } from '@three.ez/instanced-mesh'
import Random from '@utils/random'
import { MathUtils, Vector3 } from 'three'

export default class Gears {
  static base
  static iMesh

  constructor(grid) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
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

    const offset = new Vector3(0.1, 2, 0.35)
    const scale = new Vector3(0.7, 3.8, 0.7)

    this.iMesh.addInstances(this.grid.height * 2, (obj, index) => {
      const onLeft = index < this.grid.height
      obj.position.x = onLeft ? this.grid.minX - offset.x : this.grid.maxX + offset.x
      obj.position.y = offset.y
      obj.position.z = this.grid.minZ + offset.z + (index % this.grid.height)

      obj.scale.copy(scale)

      obj.rotation.x = 90 * MathUtils.DEG2RAD
      obj.rotation.y = Random.float({ max: 10 })
    })
  }

  update() {
    this.iMesh.instances.forEach((obj, index) => {
      const onLeft = index < this.grid.height
      const direction = onLeft ? -1 : 1
      obj.rotation.y += Math.sin(this.time.elapsed) * 0.01 * direction
      obj.updateMatrix()
    })
  }
}
