import Experience from '@experience'
import { getParticleSystem } from '@utils/getParticleSystem'
import gsap from 'gsap'
import { AmbientLight, Color, PointLight, Vector3 } from 'three'

export default class Environment {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.scene = this.experience.scene
    this.camera = this.experience.camera
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
    this.setParticles()

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

    gsap.to(this.pointLights, {
      intensity: '*=1.5',
      duration: () => 0.2 + Math.random() * 0.1,
      delay: () => Math.random() * 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
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

  setParticles() {
    this.particles = this.pointLights.map((pl, i) =>
      getParticleSystem({
        camera: this.camera.instance,
        emitter: pl,
        parent: this.scene,
        rate: 50.0,
        texture: './particles/fire.png',
        radius: 0.1,
        offset: new Vector3(0, -0.4, 0.1 * (i > 1 ? -1 : 1)),
        color: new Color(0xff8080),
      }),
    )
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

  update() {
    this.particles.forEach(p => p.update(this.time.delta * 0.5))
  }
}
