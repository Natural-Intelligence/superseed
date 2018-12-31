const RestService = require('restful-model');
const { BaseDataSource } = require('super-seed-core');
// const BaseDatasource = require('../BaseDatasource');
const {fetchRequest, fetchResponse} = RestService.defaultMiddlewares;

module.exports = class APISource {
  constructor({baseURL, responseHandler = response => response}) {
    this.service = new RestService(baseURL);
    this.service.useMiddlewares([
      (input, next) => {
        input.headers['Content-Type'] = 'application/json';
        next(input);
      },
      fetchRequest,
      fetchResponse,
      (input, next, resolve, originalInput) => {
        next(responseHandler(input));
      }
    ]);
  }

  defineEntity(options) {
    const {basePath, name = 'UNKNOWN'} = options;
    const model = this.service.registerModel(name, basePath);
    return new APISeeder(model);
  }
};

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
