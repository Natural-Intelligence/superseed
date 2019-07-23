class DataSource {
  constructor(options = null) {
    if(options) {
      const {createSeeds, deletedSeeds } = options;
      Object.assign(this, { seedCb: createSeeds, unseedCb: deletedSeeds });
    }
  }

  async createSeeds(seeds) {
     if(this.seedCb){
       return this.seedCb(seeds);
     }
    throw new Error('Unimplemented Method');  }

  async deleteSeeds(seeds) {
    if(this.seedCb){
      return this.seedCb(seeds);
    }
    throw new Error('Unimplemented Method');  }
}

module.exports = DataSource;
