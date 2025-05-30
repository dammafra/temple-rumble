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
    path: './models/gear.glb',
  },
  {
    name: 'pillar',
    type: 'gltfModel',
    path: './models/pillar.glb',
  },
  {
    name: 'torch',
    type: 'gltfModel',
    path: './models/torch.glb',
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
  {
    name: 'shadow',
    type: 'texture',
    path: './textures/shadow.jpg',
  },
  // sounds
  {
    name: 'cogs',
    type: 'sound',
    path: './sounds/cogs.mp3',
  },
  {
    name: 'collision',
    type: 'sound',
    path: './sounds/collision.mp3',
  },
  {
    name: 'death',
    type: 'sound',
    path: './sounds/death.mp3',
  },
  {
    name: 'loop',
    type: 'sound',
    path: './sounds/loop.mp3',
  },
  {
    name: 'pillars',
    type: 'sound',
    path: './sounds/pillars.mp3',
  },
  {
    name: 'run',
    type: 'sound',
    path: './sounds/run.mp3',
  },
]

export default resourcesConfig.filter(s => !s.skip)
