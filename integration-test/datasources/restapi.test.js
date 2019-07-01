const {describe, it} = require('mocha');
const {expect} = require('chai');
const nock = require('nock');

const {Seeder, SeedJob} = require('../../packages/superseed');
const APISource = require('../../packages/superseed-restapi');
const {BaseMockGenerator} = require('../../packages/superseed-core');

const responseHandler = response => {
   return response;
};

const myService = new APISource({
  baseURL: 'http://localhost:1234/api/v1',
  responseHandler
});

const myEntity = myService.defineEntity({
  basePath: '/entities',
  name: 'Entity',
  idField: 'entityId'
});

class MyGenerator extends BaseMockGenerator {
  generateMock() {
    return {
      name: 'test'
    };
  }
}

describe('API seeder tests', () => {
  before(() => {
    nock('http://localhost:1234/api/v1')
      .post('/entities', {name: 'test'})
        .reply(201, { name: 'test', entityId: 1 })
        .log((data) => console.log(data));

    nock('http://localhost:1234/api/v1')
      .delete('/entities/1')
        .reply(200, { name: 'test', entityId: 1, deleted: true })
        .log((data) => console.log(data));
  });

  it('must save seed to via API', async () => {
    const peopleSeeder = new SeedJob('users', new MyGenerator(), myEntity);
    const seeder = new Seeder();
    seeder.addJob(peopleSeeder, {count:1});
    const data = await seeder.seed();
    expect(data).to.eql({users: [{name: 'test', entityId: 1}]});

    const deleteRes = await seeder.unseed();
    expect(deleteRes.users[0].deleted).to.eql(true);
  });
});
