import Experience from '@experience'
import { Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace } from 'three'

export default class Walls {
  constructor() {
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    const textures = {
      aoMap: this.resources.items.bricksAO,
      displacementMap: this.resources.items.bricksDisplacement,
      map: this.resources.items.bricksDiffuse,
      normalMap: this.resources.items.bricksNormal,
      // roughness: this.resources.items.bricksRoughness,
    }

    textures.map.colorSpace = SRGBColorSpace

    const material = new MeshStandardMaterial({ ...textures, displacementScale: 0.1 })

    this.wallN = new Mesh(new PlaneGeometry(8, 4), material)
    this.wallN.position.y = 2
    this.wallN.position.z = -2

    this.wallW = new Mesh(new PlaneGeometry(5, 4), material)
    this.wallW.rotation.y = Math.PI * 0.5
    this.wallW.position.x = -4
    this.wallW.position.y = 2
    this.wallW.position.z = 0.5

    this.wallE = this.wallW.clone()
    this.wallE.rotation.y += Math.PI
    this.wallE.position.x = -this.wallW.position.x

    this.scene.add(this.wallN, this.wallW, this.wallE)
  }
}
