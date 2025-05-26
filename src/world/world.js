import Experience from '@experience'
import Environment from './environment'
import Grid from './grid'
import Walls from './walls'

export default class World {
  constructor() {
    this.experience = Experience.instance

    this.environment = new Environment()
    this.grid = new Grid()
    this.walls = new Walls()
    // this.gears = new Gears()
  }
}
