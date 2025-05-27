import Experience from '@experience'
import Debug from '@utils/debug'
import CameraControls from 'camera-controls'
import gsap from 'gsap'
import {
  Box3,
  MathUtils,
  Matrix4,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Sphere,
  Spherical,
  Vector2,
  Vector3,
  Vector4,
} from 'three'

const subsetOfTHREE = {
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
}

CameraControls.install({ THREE: subsetOfTHREE })

export default class Camera {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setControls()

    this.setDebug()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.aspectRatio, 0.1, 100)
    this.scene.add(this.instance)
  }

  setControls() {
    this.controls = new CameraControls(this.instance, this.canvas)
    this.controls.minDistance = 4
    this.controls.maxDistance = 80
    this.controls.maxPolarAngle = 90 * MathUtils.DEG2RAD - 0.2
    this.controls.restThreshold = 0.00009
    this.controls.smoothTime = 0.25

    if (Debug.enabled) return

    this.controls.touches.one =
      this.controls.touches.two =
      this.controls.touches.three =
      this.controls.mouseButtons.left =
      this.controls.mouseButtons.middle =
      this.controls.mouseButtons.right =
      this.controls.mouseButtons.wheel =
        CameraControls.ACTION.NONE
  }

  resize() {
    this.instance.aspect = this.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }

  update() {
    if (!this.controls.enabled) return

    this.controls.update(this.time.delta)
    this.cameraPositionPane?.refresh()
  }

  tilt() {
    const intensity = this.sizes.isPortrait ? 0.01 : 0.05
    const duration = 0.1
    const originalRotation = this.instance.rotation.clone()

    this.controls.enabled = false

    return gsap.to(this.instance.rotation, {
      y: this.sizes.isPortrait ? intensity : originalRotation.y,
      z: this.sizes.isPortrait ? originalRotation.z : intensity,
      duration,
      repeat: 5,
      yoyo: true,
      ease: 'power1.inOut',
      onComplete: () => {
        this.instance.rotation.copy(originalRotation)
        this.controls.enabled = true
      },
    })
  }

  setDebug() {
    if (!this.debug) return

    const folder = this.debug.root.addFolder({ title: '🎥 camera', index: 4, expanded: false })

    folder
      .addBinding(this.controls, 'enabled', { label: 'controls' })
      .on('change', e => (this.cameraPositionPane.disabled = e.value))

    this.cameraPositionPane = folder.addBinding(this.instance, 'position', { disabled: true })

    folder
      .addBinding(this.instance, 'fov')
      .on('change', () => this.instance.updateProjectionMatrix())

    folder.addButton({ title: 'tilt' }).on('click', () => this.tilt())
  }
}
