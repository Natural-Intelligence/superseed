const {describe, it} = require('mocha');
const {expect} = require('chai');
const {MongoMemoryServer} = require('mongodb-memory-server');


const {Seeder, SeedJob} = require('../../packages/superseed');
const MongoDBSource = require('../../packages/superseed-mongodb');
const {BaseMockGenerator} = require('../../packages/superseed-core');

class MyGenerator extends BaseMockGenerator {
  generate(db, count) {
    return [...Array(count).keys()].map(() => ({
      name: 'test'
    }));
  }
}

describe('seeder', () => {
  let mongod, uri, port, dbPath, dbName;

  before(async () => {
    mongod = new MongoMemoryServer();
    uri = await mongod.getConnectionString();
    port = await mongod.getPort();
    dbPath = await mongod.getDbPath();
    dbName = await mongod.getDbName();
  });


  after(() => mongod.stop());

  it('must save seed to db', async () => {
    const mongodbSource = new MongoDBSource({
      url: uri,
      dbName: 'test-seeds',
    });

    const peopleSeeder = new SeedJob('users', new MyGenerator(), mongodbSource.collection('users'));

    const seeder = new Seeder();
    seeder.addJob(peopleSeeder, 1);
    const data = await seeder.seed();
    expect(data.users[0].name).to.eql('test');
    expect(data.users[0]).to.haveOwnProperty('_id');
    await seeder.unseed();
  });
});
