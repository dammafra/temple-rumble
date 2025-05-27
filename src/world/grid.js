import Experience from '@experience'
import Random from '@utils/random'
import { Box3, Group, Vector3 } from 'three'

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

    // Base tile setup
    this.baseTile = this.experience.resources.items.floor.scene.children.at(0).children.at(0)

    const box = new Box3().setFromObject(this.baseTile)
    const center = new Vector3()
    box.getCenter(center).negate()
    this.baseTile.geometry.translate(center.x, center.y, center.z)

    this.baseTile.position.y = -0.1
    this.baseTile.scale.setScalar(this.size)

    this.init()
  }

  init() {
    this.tilesGroup = new Group()
    this.scene.add(this.tilesGroup)

    for (let z = this.minZ + 1; z <= this.maxZ; z++) {
      for (let x = this.minX + 1; x <= this.maxX; x++) {
        const tile = this.baseTile.clone()
        tile.position.x = x - this.offset
        tile.position.z = z - this.offset
        tile.rotation.y = Math.PI * 0.5 * Random.integer({ max: 3 })
        this.tilesGroup.add(tile)
      }
    }
  }
}
