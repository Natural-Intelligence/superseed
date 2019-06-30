const {Schema} = require('mocker-data-generator');
const {BaseMockGenerator} = require('@superseed/core');
const set = require('lodash.set');

class MockDataGeneratorSchema extends BaseMockGenerator {
  constructor(name, schema) {
    super();
    this.schema = schema;
    this.name = name;
  }

  getSchema() {
    return this.schema;
  }

  /**
   * @override
   * @param db
   * @param staticFields
   * @returns {*}
   */
  generateMock(db, staticFields = {}) {
    const schemaDef = Object.assign({}, this.schema);
    Object.entries(staticFields).forEach(([field, value]) => {
      set(schemaDef, field, {function: () => value});
    });
    const schema = new Schema(this.name, schemaDef, 1);
    return schema.build(db)[0];
  }
}

module.exports = {MockDataGeneratorSchema};
