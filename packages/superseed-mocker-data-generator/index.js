const { Schema } = require('mocker-data-generator');
const { BaseMockGenerator } = require('@superseed/core');

class MockDataGeneratorSchema extends BaseMockGenerator {
  constructor(name, schema) {
    super();
    this.schema = schema;
    this.name = name;
  }

  getSchema() {
    return this.schema;
  }

  generate(db, count) {
    const schema = new Schema(this.name, this.schema, count);
    return schema.build(db);
  }
}

module.exports = { MockDataGeneratorSchema };
