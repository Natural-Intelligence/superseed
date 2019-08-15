const dummy = require('mongoose-dummy');
const mongoose = require('mongoose');
const set = require('lodash.set');
const get = require('lodash.get');
const has = require('lodash.has');
const {
  MockGenerator,
  generators: { hasMany, hasOne },
} = require('@superseed/core');

// const mongooseDummyOptions = { autoDetect: false };

module.exports = class MongooseMockGenerator extends MockGenerator {
  constructor(modelName, mongooseSchema, options = {}) {
    super();
    this.mongooseSchema = mongooseSchema;
    this.modelName = modelName;
    this.options = options;
    this.model = mongoose.model(this.modelName, this.mongooseSchema);
  }

  getStaticValues(staticFields) {
    const paths = dummy.getPaths(this.mongooseSchema);
    const forceValues = {};
    Object.keys(paths).forEach((path) => {
      if (has(staticFields, path)) {
        forceValues[path] = get(staticFields, path);
      }
    });
    return forceValues;
  }

  buildOptions(db, staticFields) {
    const options = {
      force: this.getStaticValues(staticFields),
      custom: {
        email: [], phone: [], address: [], password: [],
      },
    };
    const generateLater = [];
    Object.keys(this.options).forEach((field) => {
      if (options.force[field]) {
        // skip
      } else if (typeof this.options[field].generator === 'function') {
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

  generateMock(db, staticFields = {}) {
    const paths = dummy.getPaths(this.mongooseSchema);
    const [options, generateLater] = this.buildOptions(db, staticFields);
    const mockObject = dummy(this.model, options);

    generateLater.forEach((field) => {
      if (paths[field]) {
        let fieldValue;
        if (paths[field].type === 'Array') {
          const max = this.options[field].max || 5;
          const min = this.options[field].min || 1;
          const randomNum = Math.floor((Math.random() * max) + min);
          fieldValue = Array.from(new Array(randomNum))
            .map(() => this.options[field].generator
              .call({ db, object: mockObject }, db, mockObject));
        } else {
          fieldValue = this.options[field].generator
            .call({ db, object: mockObject }, db, mockObject);
        }
        set(mockObject, field, fieldValue);
      }
    });
    return mockObject;
  }
};
