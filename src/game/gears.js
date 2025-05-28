import Experience from '@experience'
import { InstancedMesh2 } from '@three.ez/instanced-mesh'
import Random from '@utils/random'
import { MathUtils, Vector3 } from 'three'

export default class Gears {
  static base
  static iMesh

  constructor(game) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.grid = game.grid
    this.offset = new Vector3(0.1, 2, 0.35)
    this.scale = new Vector3(0.7, 3.8, 0.7)

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
      const onLeft = index < this.grid.height
      obj.position.x = onLeft ? this.grid.minX - this.offset.x : this.grid.maxX + this.offset.x
      obj.position.y = this.offset.y
      obj.position.z = this.grid.minZ + this.offset.z + (index % this.grid.height)

      obj.scale.copy(this.scale)

      obj.rotation.x = 90 * MathUtils.DEG2RAD
      obj.rotation.y = Random.float({ max: 10 })
    })
  }

  setRotation(index, directionIn) {
    const onLeft = index < this.grid.height
    const gear = this.iMesh.instances.at(index)

    gear.rotation.y += 0.01 * (directionIn ? 1 : -1) * (onLeft ? -1 : 1)
    gear.updateMatrix()
  }
}
