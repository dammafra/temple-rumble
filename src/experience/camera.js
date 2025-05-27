import Experience from '@experience'
import Debug from '@utils/debug'
import CameraControls from 'camera-controls'
import {
  Box3,
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
    this.settings = this.experience.settings
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.boundary = 10

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
    this.controls.maxPolarAngle = Math.PI / 2 - 0.2
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
  }
}
