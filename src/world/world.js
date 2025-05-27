import Experience from '@experience'
import Environment from './environment'
import Gear from './gear'
import Grid from './grid'
import Walls from './walls'

export default class World {
  constructor() {
    this.experience = Experience.instance

    this.environment = new Environment()
    this.grid = new Grid()
    this.walls = new Walls(this.grid)
    this.gears = Array.from({ length: this.grid.height * 2 }, (_, i) => new Gear(this.grid, i))
  }

  update() {
    this.gears.forEach(g => g.update())
  }
}
