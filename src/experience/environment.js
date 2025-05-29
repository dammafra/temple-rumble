import Experience from '@experience'
import { AmbientLight, PointLight, Vector3 } from 'three'

export default class Environment {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.ambientLightColor = '#cf943b'
    this.pointLightColor = '#cf943b'
    this.pointLightPositions = [
      new Vector3(-2.5, 2.5, -1.7),
      new Vector3(2.5, 2.5, -1.7),
      new Vector3(-2.5, 2.5, 2.7),
      new Vector3(2.5, 2.5, 2.7),
    ]

    this.setAmbientLight()
    this.setPointLights()
    this.setMeshes()

    this.setDebug()
  }

  setAmbientLight() {
    this.ambientLight = new AmbientLight(this.ambientLightColor, 1)
    this.scene.add(this.ambientLight)
  }

  setPointLights() {
    this.pointLights = this.pointLightPositions.map(p => {
      const pointLight = new PointLight(this.pointLightColor, 30)
      pointLight.position.copy(p)
      this.scene.add(pointLight)
      return pointLight
    })
  }

  setMeshes() {
    this.resources.items.torch.scene.traverse(child => {
      if (child.name === 'coffin___gravesTorch_low') this.base = child
    })
    this.base.scale.setScalar(0.05)

    this.meshes = this.pointLightPositions.map((p, i) => {
      const mesh = this.base.clone()
      mesh.position.copy(p)
      mesh.position.y -= 1.8
      mesh.rotation.y = i > 1 ? Math.PI : 0
      this.scene.add(mesh)
      return mesh
    })
  }

  setDebug() {
    if (!this.debug) return

    const folder = this.debug.root.addFolder({ title: '💡 environment', expanded: false })
    folder
      .addBinding(this, 'ambientLightColor', { label: 'ambient color' })
      .on('change', e => this.ambientLight.color.set(e.value))

    folder
      .addBinding(this, 'pointLightColor', { label: 'lights color' })
      .on('change', e => this.pointLights.forEach(pl => pl.color.set(e.value)))

    folder
      .addBinding(this.pointLights.at(0), 'intensity', { label: 'lights intensity' })
      .on('change', e => this.pointLights.forEach(pl => (pl.intensity = e.value)))
  }
}
