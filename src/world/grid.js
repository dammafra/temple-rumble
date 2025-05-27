import Experience from '@experience'
import { InstancedMesh2 } from '@three.ez/instanced-mesh'
import Random from '@utils/random'
import { Box3, MathUtils, Vector3 } from 'three'

export default class Grid {
  get minX() {
    return -Math.floor(this.width / 2)
  }

  get maxX() {
    return Math.ceil(this.width / 2)
  }

  get minZ() {
    return -Math.floor(this.height / 2)
  }

  get maxZ() {
    return Math.ceil(this.height / 2)
  }

  constructor() {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.width = 8
    this.height = 5
    this.size = 2.5
    this.offset = 0.5

    this.initBase()
    this.init()
  }

  initBase() {
    this.base = this.experience.resources.items.floor.scene.children.at(0).children.at(0)

    const box = new Box3().setFromObject(this.base)
    const center = new Vector3()
    box.getCenter(center).negate()
    this.base.geometry.translate(center.x, center.y, center.z)
  }

  init() {
    this.iMesh = new InstancedMesh2(this.base.geometry, this.base.material, { allowsEuler: true })
    this.scene.add(this.iMesh)

    this.iMesh.addInstances(this.width * this.height, (obj, index) => {
      const { x, z } = this.getCoordinates(index)
      obj.position.x = x + this.offset
      obj.position.z = z + this.offset
      obj.position.y = -0.1
      obj.scale.setScalar(this.size)
      obj.rotation.y = 90 * MathUtils.DEG2RAD * Random.integer({ max: 3 })
    })
  }

  getCoordinates(index) {
    const row = Math.floor(index / this.width)
    const col = index % this.width
    const x = this.minX + col
    const z = this.minZ + row
    return { x, z }
  }
}
