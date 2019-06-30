module.exports = class SeedJob {
    constructor(key, mockGenerator, seeder){
        this.key = key;
        this.mockGenerator = mockGenerator;
        this.seeder = seeder;
    }

    getKey(){
        return this.key;
    }

  generateSeeds(db, options) {
    const {count , staticFields , getStaticFields} = options;
    if (count && getStaticFields) {
      return (new Array(count)).map(() => this.mockGenerator.generateMock(db, getStaticFields(db)))
    }else if (count) {
      return (new Array(count)).map(() => this.mockGenerator.generateMock(db, {}))
    } else if (staticFields) {
      return staticFields.map(() => this.mockGenerator.generateMock(db, {}));
    }
    throw new Error('Invalid options');
  }

    createSeeds(models){
        return this.seeder.createSeeds(models);
    }

    deleteSeeds(models) {
      return this.seeder.deleteSeeds(models);
    }
};
