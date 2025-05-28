import Experience from '@experience'
import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three'

export default class Walls {
  constructor(game) {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.renderer = this.experience.renderer
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.height = 4
    this.grid = game.grid

    this.setHorizontalWalls()
    this.setVerticalWalls()
    this.setBlackBox()
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
    const geometry = new PlaneGeometry(
      this.grid.width,
      this.height + Math.abs(this.grid.offset.y) * 2,
    )
    const material = new MeshStandardMaterial({
      ...this.getTextures(this.grid.width),
      displacementScale: 0.1,
    })

    this.wallTop = new Mesh(geometry, material)
    this.wallTop.position.z = this.grid.minZ
    this.wallTop.position.y = this.height / 2 + this.grid.offset.y
    this.wallTop.position.x = this.grid.width % 2 ? 0.5 : 0

    this.wallBottom = this.wallTop.clone()
    this.wallBottom.rotation.y += 180 * MathUtils.DEG2RAD
    this.wallBottom.position.z = this.grid.maxZ

    this.scene.add(this.wallTop, this.wallBottom)
  }

  setVerticalWalls() {
    const offset = 1
    const geometry = new PlaneGeometry(this.grid.height, this.height - offset)
    const material = new MeshStandardMaterial({
      ...this.getTextures(this.grid.height),
      displacementScale: 0,
    })

    this.wallLeft = new Mesh(geometry, material)
    this.wallLeft.rotation.y = 90 * MathUtils.DEG2RAD
    this.wallLeft.position.x = this.grid.minX
    this.wallLeft.position.y = (this.height - offset) / 2 + offset
    this.wallLeft.position.z = this.grid.height % 2 ? 0.5 : 0

    this.wallRight = this.wallLeft.clone()
    this.wallRight.rotation.y += 180 * MathUtils.DEG2RAD
    this.wallRight.position.x = this.grid.maxX

    this.scene.add(this.wallLeft, this.wallRight)
  }

  setBlackBox() {
    const width = 5
    const geometry = new PlaneGeometry(width, this.grid.height + 2)
    const material = new MeshBasicMaterial({ color: 'black' })

    this.blackBoxLeft = new Mesh(geometry, material)
    this.blackBoxLeft.rotation.x = -90 * MathUtils.DEG2RAD
    this.blackBoxLeft.position.x = this.grid.minX - width / 2
    this.blackBoxLeft.position.y = this.height
    this.blackBoxLeft.position.z = this.grid.height % 2 ? 0.5 : 0

    this.blackBoxRight = this.blackBoxLeft.clone()
    this.blackBoxLeft.position.x = this.grid.maxX + width / 2

    this.scene.add(this.blackBoxLeft, this.blackBoxRight)
  }
}
