const SeedJob = require('./SeedJob');

const handleError = (err) => {
  console.log(err);
};

module.exports = class Seeder {
  constructor(db = {}, { errorHandler = handleError} = {}) {
    this.models = {};
    this.db = db;
    this.handleError = errorHandler;
  }

  defineJob(entityKey, seedJob) {
    if(this.models[entityKey]){
      // backward compatibility - ignore. Should throw in next major version
      this.models[entityKey].job = seedJob;
      return this;
    }
    this.models[entityKey] = {
      job: seedJob,
      seedOptions: []
    };
    return this;
  }

  addSeed(entityKey, options) {
    if(!this.models[entityKey]){
      throw new Error(`No SeedJob defined for this entity. Please define before adding seeds`);
    }
    this.models[entityKey].seedOptions.push(options);
    return this;
  }

  // addJob(seedJob, options = {}) {
  //   this.defineJob(seedJob.getKey(), seedJob);
  //   this.addSeed(seedJob.getKey(), options);
  //   return this;
  // }
  //   addJob(seedJob, options = {})
  //   addJob(key, mockGenerator, seeder, options)
  addJob(...args) {
     if(typeof arguments[0] === 'string') {
       if(arguments.length === 4) {
         const [key, mockGenerator,seeder, options ] = arguments;
         this.defineJob(key, new SeedJob(key, mockGenerator, seeder));
         this.addSeed(key, options);
       } else if(arguments.length === 3) {
         const [key, mockGenerator,seeder ] = arguments;
         this.defineJob(key, new SeedJob(key, mockGenerator, seeder));
       }
     } else if(typeof arguments[0] === SeedJob) {
       const [seedJob, options] = arguments;
       this.defineJob(seedJob.getKey(), seedJob);
       this.addSeed(seedJob.getKey(), options);
     }
    return this;
  }

  async seed() {
    const {db} = this;
    const entityKeys = Object.keys(this.models);
    try {
      for (const modelKey of entityKeys) {
        const {seedOptions, job: seedJob} = this.models[modelKey];
        db[modelKey] = [];
        for(let options of seedOptions) {
          const models = seedJob.generateSeeds(db, options);
          const seeds = await seedJob.createSeeds(models);
          db[modelKey].push(...seeds);
        }
      }
    } catch (e) {
      this.handleError(e);
    }
    this.db = db;
    return db;
  }

  async unseed() {
    const {db} = this;
    const entityKeys = Object.keys(this.models);
    const deletedResult = {};
    try {
      for (const modelKey of entityKeys) {
        const modelConfig = this.models[modelKey];
        const models = db[modelKey];
        deletedResult[modelKey] = await modelConfig.job.deleteSeeds(models);
      }
    } catch (e) {
      this.handleError(e);
    }
    this.reset();
    return deletedResult;
  }

  reset(){
    this.db = {};
    this.models = {};
  }
};
