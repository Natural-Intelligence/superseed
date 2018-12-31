module.exports = class Seeder {
    constructor() {
      this.models = {};
    }
  
    addJob(entitySeed, count) {
      this.models[entitySeed.getKey()] = {
        generateSeeds: (db) => {
          return entitySeed.generateSeeds(db, count);
        },
        createSeeds: model => {
          return entitySeed.createSeeds(model);
        }
      };
        
      return this;
    }
  
    async seed() {
      const db = {};
      const entityKeys = Object.keys(this.models);
      try {
        for (const modelKey of entityKeys) {
          const modelConfig = this.models[modelKey];
          db[modelKey] = [];
          const models = modelConfig.generateSeeds(db);
          db[modelKey] = await modelConfig.createSeeds(models);
        }
      } catch (e) {
        console.log('Error:', e);
      }
      return db;
    }
  };
  