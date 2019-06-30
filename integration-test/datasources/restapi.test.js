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
  name: 'Entity'
});

class MyGenerator extends BaseMockGenerator {
  generateMock() {
    return {
      name: 'test'
    };
  }
}

describe('seeder', () => {
  before(() => {
    nock('http://localhost:1234/api/v1')
      .post('/entities', {name: 'test'})
        .reply(201, { name: 'test', id: 'id' })
        .log((data) => console.log(data));
  });

  it('must save seed to db', async () => {
    const peopleSeeder = new SeedJob('users', new MyGenerator(), myEntity);
    const seeder = new Seeder();
    seeder.addJob(peopleSeeder, {count:1});
    const data = await seeder.seed();
    expect(data).to.eql({users: [{name: 'test', id: 'id'}]});
  });
});
