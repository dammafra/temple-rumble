import Experience from '@experience'
import { InstancedMesh2 } from '@three.ez/instanced-mesh'
import { MathUtils, Vector3 } from 'three'

export default class Pillars {
  constructor(grid) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.renderer = this.experience.renderer
    this.scene = this.experience.scene

    this.color = '#7c93d2'
    this.grid = grid
    this.offset = new Vector3(1.6, 0.5, 0.5)
    this.scale = new Vector3(0.07, 0.135, 0.1) // TODO: `0.135` should be computed from `this.grid.width / 2`

    this.initBase()
    this.init()
  }

  direction(index) {
    return index < this.grid.height ? -1 : 1
  }

  initBase() {
    this.resources.items.pillar.scene.traverse(child => {
      if (child.name === 'Totemp_low_Totem_0') this.base = child
    })
    this.base.material.color.set(this.color)
  }

  init() {
    this.iMesh = new InstancedMesh2(this.base.geometry, this.base.material, {
      allowsEuler: true,
      createEntities: true,
    })
    this.scene.add(this.iMesh)

    this.count = this.grid.height * 2
    this.iMesh.addInstances(this.count, (obj, index) => {
      obj.position.x = this.getPositionX(index, 1)
      obj.position.y = this.offset.y
      obj.position.z = this.grid.minZ + this.offset.z + (index % this.grid.height)

      obj.scale.copy(this.scale)

      obj.rotation.z = this.direction(index) * 90 * MathUtils.DEG2RAD
      obj.rotation.x = 90 * MathUtils.DEG2RAD
    })
  }

  getPositionX(index, step) {
    const max = Math.abs(this.grid.minX + this.offset.x)
    const min = max + this.grid.width / 2
    return this.direction(index) * (min - step)
  }

  setPositionX(index, step) {
    const pillar = this.iMesh.instances.at(index)
    pillar.position.x = this.getPositionX(index, step)
    pillar.updateMatrix()
  }

  getStep(index) {
    const pillar = this.iMesh.instances.at(index)

    const max = Math.abs(this.grid.minX + this.offset.x)
    const min = max + this.grid.width / 2
    return Math.floor(min - pillar.position.x * this.direction(index))
  }
}
