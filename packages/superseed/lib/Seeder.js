module.exports = class Seeder {
  constructor() {
    this.models = {};
  }

  addJob(seedJob, options) {
    this.models[seedJob.getKey()] = {
      generateSeeds: (db) => {
        return seedJob.generateSeeds(db, options);
      },
      createSeeds: models => {
        return seedJob.createSeeds(models);
      },
      deleteSeeds: models => {
        return seedJob.deleteSeeds(models);
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
    this.db = db;
    return db;
  }

  async unseed() {
    const {db} = this;
    const entityKeys = Object.keys(this.models);
    try {
      for (const modelKey of entityKeys) {
        const modelConfig = this.models[modelKey];
        const models = db[modelKey];
        db[modelKey] = await modelConfig.deleteSeeds(models);
      }
    } catch (e) {
      console.log('Error:', e);
    }
    return db;
  }
};
