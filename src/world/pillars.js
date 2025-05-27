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

    this.initBase()
    this.init()
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

    const offset = new Vector3(1.6, 0.5, 0.5)
    const scale = new Vector3(0.07, 0.135, 0.1)

    this.iMesh.addInstances(this.grid.height * 2, (obj, index) => {
      const onLeft = index < this.grid.height

      obj.position.x = onLeft ? this.grid.minX + offset.x : this.grid.maxX - offset.x
      obj.position.y = offset.y
      obj.position.z = this.grid.minZ + offset.z + (index % this.grid.height)

      obj.scale.copy(scale)

      obj.rotation.z = 90 * (onLeft ? -1 : 1) * MathUtils.DEG2RAD
      obj.rotation.x = 90 * MathUtils.DEG2RAD
    })
  }

  update() {
    this.iMesh.instances.forEach((obj, index) => {
      const onLeft = index < this.grid.height
      const direction = onLeft ? -1 : 1
      // min: abs(6.2)
      // min: abs(2.4)
      obj.position.x += Math.sin(this.time.elapsed) * 0.01 * direction
      obj.updateMatrix()
    })
  }
}
