const SeedJob = require('./SeedJob');

const handleError = (err) => {
  console.log(err);
};

module.exports = class Seeder {
  constructor(db = {}, {errorHandler = handleError} = {}) {
    this.db = db;
    this.handleError = errorHandler;
    this.seedTasks = [];
    this.jobHandlers = {};
  }

  defineJob(entityKey, seedJob) {
    if (this.jobHandlers[entityKey]) {
      // backward compatibility - ignore. Should throw in next major version
      this.jobHandlers[entityKey] = seedJob;
      return this;
    }
    this.jobHandlers[entityKey] = seedJob;
    return this;
  }

  addSeed(entityKey, options) {
    if (!this.jobHandlers[entityKey]) {
      throw new Error(`No SeedJob defined for this entity. Please define before adding seeds`);
    }
    const job = this.jobHandlers[entityKey];
    this.seedTasks.push({job, seedOptions: options, entityKey});
    return this;
  }

  //   addJob(seedJob, options = {})
  //   addJob(key, mockGenerator, seeder, options)
  addJob(...args) {
    if (typeof args[0] === 'string') {
      if (arguments.length === 4) {
        const [key, mockGenerator, seeder, options] = args;
        this.defineJob(key, new SeedJob(key, mockGenerator, seeder));
        this.addSeed(key, options);
      } else if (arguments.length === 3) {
        const [key, mockGenerator, seeder] = args;
        this.defineJob(key, new SeedJob(key, mockGenerator, seeder));
      }
    } else if (args[0] instanceof SeedJob) {
      const [seedJob, options] = args;
      this.defineJob(seedJob.getKey(), seedJob);
      this.addSeed(seedJob.getKey(), options);
    }
    return this;
  }

  async seed() {
    const {db} = this;
    try {
      for (const task of this.seedTasks) {
        const {seedOptions, job: seedJob, entityKey} = task;
        db[entityKey] = db[entityKey] || [];
        const models = seedJob.generateSeeds(db, seedOptions);
        const seeds = await seedJob.createSeeds(models);
        db[entityKey].push(...seeds);
      }
    } catch (e) {
      this.handleError(e);
    }
    return db;
  }

  async unseed() {
    const {db} = this;
    const entityKeys = Object.keys(this.jobHandlers);
    const deletedResult = {};
    try {
      for (const entityKey of entityKeys) {
        const job = this.jobHandlers[entityKey];
        const models = db[entityKey];
        deletedResult[entityKey] = await job.deleteSeeds(models);
      }
    } catch (e) {
      this.handleError(e);
    }
    this.reset();
    return deletedResult;
  }

  reset() {
    this.db = {};
    this.jobHandlers = {};
    this.seedTasks = []
  }
};
