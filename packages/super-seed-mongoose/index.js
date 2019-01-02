const dummy = require('mongoose-dummy');
const mongoose = require('mongoose');
const {BaseMockGenerator} = require('super-seed-core');

module.exports = class MongooseMockGenerator extends BaseMockGenerator {
  constructor(modelName, mongooseSchema, momgooseDummyOptions = {}) {
    super();
    this.mongooseSchema = mongooseSchema;
    this.options = momgooseDummyOptions;
    this.modelName = modelName;
  }

  generate(db, count) {
    const model = mongoose.model(this.modelName, this.mongooseSchema);
    const data = [...new Array(count).keys()].map(() => {
      return dummy(model, this.options);
    });
    return data;
  }
};
