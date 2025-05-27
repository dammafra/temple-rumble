const resourcesConfig = [
  // models
  {
    name: 'character',
    type: 'gltfModel',
    path: './models/character.glb',
  },
  {
    name: 'floor',
    type: 'gltfModel',
    path: './models/floor.glb',
  },
  {
    name: 'gear',
    type: 'gltfModel',
    path: './models/gear4.glb',
  },
  {
    name: 'pillar',
    type: 'gltfModel',
    path: './models/pillar.glb',
  },
  // textures
  {
    name: 'bricksAO',
    type: 'texture',
    path: './textures/bricks/ao.png',
  },
  {
    name: 'bricksDiffuse',
    type: 'texture',
    path: './textures/bricks/diffuse.png',
  },
  {
    name: 'bricksDisplacement',
    type: 'texture',
    path: './textures/bricks/displacement.png',
  },
  {
    name: 'bricksNormal',
    type: 'texture',
    path: './textures/bricks/normal.png',
  },
  {
    name: 'bricksRoughness',
    type: 'texture',
    path: './textures/bricks/roughness.png',
    skip: true,
  },
]

export default resourcesConfig.filter(s => !s.skip)
