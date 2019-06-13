const RestService = require('restful-model');
const { BaseDataSource } = require('@superseed/core');
// const BaseDatasource = require('../BaseDatasource');
const { fetchRequest, fetchResponse } = RestService.defaultMiddlewares;

class APISeeder extends BaseDataSource {
  constructor(model) {
    super();
    this.model = model;
  }

  async createSeeds(seeds) {
    const saved = await Promise.all(seeds.map(seed => this.model.create(seed)));
    return saved;
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
    const { basePath, name = 'UNKNOWN' } = options;
    const model = this.service.registerModel(name, basePath);
    return new APISeeder(model);
  }
};
