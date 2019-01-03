const dummy = require('mongoose-dummy');
const mongoose = require('mongoose');
const {
  BaseMockGenerator,
  generators: {hasMany, hasOne}
} = require('super-seed-core');

const mongooseDummyOptions = {autoDetect: false};

module.exports = class MongooseMockGenerator extends BaseMockGenerator {
  constructor(modelName, mongooseSchema, options = {}) {
    super();
    this.mongooseSchema = mongooseSchema;
    this.modelName = modelName;
    this.options = options;
    this.model = mongoose.model(this.modelName, this.mongooseSchema);
  }

  buildOptions(db) {
    let options = {force: {}, custom: {email: []}};
    Object.keys(this.options).forEach(field => {
      if (this.options[field].generator === 'hasMany') {
        options.force[field] = hasMany(db, this.options[field]);
      } else if (this.options[field].generator === 'hasOne') {
        options.force[field] = hasOne(db, this.options[field]);
      }
      // else if (this.options[field].generator === 'email') {
      //   options.custom.email.push(field);
      // }
    });
    return options;
  }

  generate(db, count) {
    const data = [...new Array(count).keys()].map(() => {
      const options = this.buildOptions(db);
      return dummy(this.model, options);
    });
    return data;
  }
};
