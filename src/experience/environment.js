import Experience from '@experience'
import { AmbientLight, PointLight } from 'three'

export default class Environment {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.scene = this.experience.scene

    this.setLight()
    this.setDebug()
  }

  setLight() {
    this.ambientLightColor = '#cf943b'
    this.ambientLight = new AmbientLight(this.ambientLightColor, 1)
    this.scene.add(this.ambientLight)

    this.pointLightColor = '#cf943b'
    this.pointLight = new PointLight(this.pointLightColor, 30)
    this.pointLight.position.set(-2.5, 2.5, -1.7)

    this.pointLight2 = this.pointLight.clone()
    this.pointLight2.position.set(2.5, 2.5, -1.7)

    this.pointLight3 = this.pointLight.clone()
    this.pointLight3.position.set(-2.5, 2.5, 2.7)

    this.pointLight4 = this.pointLight.clone()
    this.pointLight4.position.set(2.5, 2.5, 2.7)

    this.scene.add(this.pointLight, this.pointLight2, this.pointLight3, this.pointLight4)
  }

  setDebug() {
    if (!this.debug) return

    const folder = this.debug.root.addFolder({ title: '💡 environment', expanded: false })
    folder
      .addBinding(this, 'ambientLightColor', { label: 'ambient color' })
      .on('change', e => this.ambientLight.color.set(e.value))

    folder.addBinding(this, 'pointLightColor', { label: 'lights color' }).on('change', e => {
      this.pointLight.color.set(e.value)
      this.pointLight2.color.set(e.value)
      this.pointLight3.color.set(e.value)
      this.pointLight4.color.set(e.value)
    })

    folder
      .addBinding(this.pointLight, 'intensity', { label: 'lights intensity' })
      .on('change', e => {
        this.pointLight2.intensity = e.value
        this.pointLight3.intensity = e.value
        this.pointLight4.intensity = e.value
      })

    folder.addBinding(this.pointLight, 'position', { label: 'lights position' })
  }
}
