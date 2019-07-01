const RestService = require('restful-model');
const { BaseDataSource } = require('@superseed/core');
// const BaseDatasource = require('../BaseDatasource');
const { fetchRequest, fetchResponse } = RestService.defaultMiddlewares;

class APISeeder extends BaseDataSource {
  constructor(model, {idField} = {}) {
    super();
    this.model = model;
    this.idField = idField;
  }

  async createSeeds(seeds) {
    const saved = await Promise.all(seeds.map(seed => this.model.create(seed)));
    return saved;
  }

  async deleteSeeds(seeds) {
     const idField = this.idField;
    return Promise.all(seeds.map((seed) => {
      return this.model.delete({id: seed[idField]});
    }));
  }
}

module.exports = class APISource {
  constructor({ baseURL, responseHandler = response => response }) {
    this.service = new RestService(baseURL);
    this.service.useMiddlewares([
      (input, next) => {
        const _input = input;
        _input.headers['Content-Type'] = 'application/json';
        next(input);
      },
      fetchRequest,
      fetchResponse,
      (input, next) => {
        next(responseHandler(input));
      },
    ]);
  }

  defineEntity(options) {
    const { basePath, name = 'UNKNOWN', idField = 'id' } = options;
    const model = this.service.registerModel(name, basePath);
    return new APISeeder(model, {idField});
  }
};
