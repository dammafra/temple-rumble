import Experience from '@experience'
import { Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace } from 'three'

export default class Walls {
  constructor(grid) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.renderer = this.experience.renderer
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.height = 4
    this.grid = grid

    this.setHorizontalWalls()
    this.setVerticalWalls()
  }

  getTextures(repeatX) {
    const textures = {
      aoMap: this.resources.items.bricksAO.clone(),
      displacementMap: this.resources.items.bricksDisplacement.clone(),
      map: this.resources.items.bricksDiffuse.clone(),
      normalMap: this.resources.items.bricksNormal.clone(),
    }

    Object.values(textures).forEach(t => {
      t.repeat.x = repeatX / 4
      t.repeat.y = this.height / 4
      t.wrapS = RepeatWrapping
      t.wrapT = RepeatWrapping
    })

    textures.map.colorSpace = SRGBColorSpace
    textures.map.anisotropy = this.renderer.maxAnisotropy

    return textures
  }

  setHorizontalWalls() {
    const geometry = new PlaneGeometry(this.grid.width, this.height)
    const material = new MeshStandardMaterial({
      ...this.getTextures(this.grid.width),
      displacementScale: 0.1,
    })

    this.wallTop = new Mesh(geometry, material)
    this.wallTop.position.z = this.grid.minZ
    this.wallTop.position.y = this.height / 2
    this.wallTop.position.x = this.grid.width % 2 ? 0.5 : 0

    this.wallBottom = this.wallTop.clone()
    this.wallBottom.rotation.y += Math.PI
    this.wallBottom.position.z = this.grid.maxZ

    this.scene.add(this.wallTop, this.wallBottom)
  }

  setVerticalWalls() {
    const geometry = new PlaneGeometry(this.grid.height, this.height)
    const material = new MeshStandardMaterial({
      ...this.getTextures(this.grid.height),
      displacementScale: 0.1,
    })

    this.wallLeft = new Mesh(geometry, material)
    this.wallLeft.rotation.y = Math.PI * 0.5
    this.wallLeft.position.x = this.grid.minX
    this.wallLeft.position.y = this.height / 2
    this.wallLeft.position.z = this.grid.height % 2 ? 0.5 : 0

    this.wallRight = this.wallLeft.clone()
    this.wallRight.rotation.y += Math.PI
    this.wallRight.position.x = this.grid.maxX

    this.scene.add(this.wallLeft, this.wallRight)
  }
}
