const dummy = require('mongoose-dummy');
const mongoose = require('mongoose');
const set = require('lodash.set');
const {
  BaseMockGenerator,
  generators: {hasMany, hasOne},
} = require('@superseed/core');

// const mongooseDummyOptions = { autoDetect: false };

module.exports = class MongooseMockGenerator extends BaseMockGenerator {
  constructor(modelName, mongooseSchema, options = {}) {
    super();
    this.mongooseSchema = mongooseSchema;
    this.modelName = modelName;
    this.options = options;
    this.model = mongoose.model(this.modelName, this.mongooseSchema);
  }

  buildOptions(db) {
    const options = {
      force: {},
      custom: {
        email: [], phone: [], address: [], password: [],
      },
    };
    const generateLater = [];
    const paths = dummy.getPaths(this.mongooseSchema);
    Object.keys(this.options).forEach((field) => {
      if (typeof this.options[field].generator === 'function') {
        generateLater.push(field);
        this.options.ignore = this.options.ignore || [];
        this.options.ignore.push(field);
      } else if (this.options[field].generator === 'hasMany') {
        options.force[field] = hasMany(db, this.options[field]);
      } else if (this.options[field].generator === 'hasOne') {
        options.force[field] = hasOne(db, this.options[field]);
      } else {
        ['email', 'phone', 'address'].forEach((fieldType) => {
          if (this.options[field].generator === fieldType) {
            options.custom[fieldType].push(field);
          }
        });
      }
    });

    return [options, generateLater];
  }

  generate(db, count) {
    const data = [...new Array(count).keys()].map(() => this.generateMock(db));
    return data;
  }

  generateMock(db) {
    const paths = dummy.getPaths(this.mongooseSchema);
    const [options, generateLater] = this.buildOptions(db);
    const mockObject = dummy(this.model, options);

    generateLater.forEach((field) => {
      let fieldValue;
      if (paths[field].type === 'Array') {
        fieldValue = [];
        const max = this.options[field].max || 5;
        const min = this.options[field].min || 1;
        const randomNum = Math.floor((Math.random() * max) + min);
        for (let i = 0; i < randomNum; i++) {
          fieldValue.push(this.options[field].generator.call({db, object: mockObject}, db, mockObject));
        }
      } else {
        fieldValue = this.options[field].generator.call({db, object: mockObject}, db, mockObject);
      }
      set(mockObject, field, fieldValue);
    });
    return mockObject;
  }
};
