module.exports = class BaseDataSource {
    async createSeeds(seeds) { 
        throw new Error('Unimplemented Method');
    }

    async deleteSeeds() {
      throw new Error('Unimplemented Method');
    }
}
