const factory = require('fakingoose');

const {
  MockGenerator,
  generators: { hasMany, hasOne },
} = require('@superseed/core');


module.exports = class MongooseMockGenerator extends MockGenerator {
  constructor(mongooseSchema, options = {}) {
    super();
    this.mongooseSchema = mongooseSchema;
    this.options = options;
  }

  buildOptions(db) {
    const options = {};
    Object.entries(this.options).forEach(([field, config]) => {
      if (config.skip) {
        options[field] = { skip: config.skip };
      } else if (typeof config.generator === 'function') {
        options[field] = {
          value: object => config.generator(db, object),
        };
      } else if (this.options[field].generator === 'hasMany') {
        options[field] = { value: hasMany(db, this.options[field]) };
      } else if (this.options[field].generator === 'hasOne') {
        options[field] = { value: hasOne(db, this.options[field]) };
      } else if (config.generator && config.generator === 'email') {
        options[field] = { type: 'email' };
      }
    });

    return options;
  }

  generateMock(db, staticFields = {}) {
    const options = this.buildOptions(db, staticFields);
    const entityFactory = factory(this.mongooseSchema, options);
    const mockObject = entityFactory.generate(staticFields);
    return mockObject;
  }
};
