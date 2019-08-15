const { Schema } = require('mocker-data-generator');
const { MockGenerator } = require('@superseed/core');
const set = require('lodash.set');

class MockDataGeneratorSchema extends MockGenerator {
  constructor(name, schema) {
    super();
    this.schema = schema;
    this.name = name;
  }

  getSchema() {
    return this.schema;
  }

  generateMock(db, staticFields = {}) {
    const schemaDef = Object.assign({}, this.schema);
    Object.entries(staticFields).forEach(([field, value]) => {
      set(schemaDef, field, { function: () => value });
    });
    const schema = new Schema(this.name, schemaDef, 1);
    return schema.build(db)[0];
  }
}

module.exports = { MockDataGeneratorSchema };
