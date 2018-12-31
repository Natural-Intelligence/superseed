const {describe, it} = require('mocha');
const {expect} = require('chai');

const {Seeder, SeedJob} = require('../../packages/super-seed');
const MongoDBSource = require('../../packages/super-seed-mongodb');
const {BaseMockGenerator} = require('../../packages/super-seed-core');

class MyGenerator extends BaseMockGenerator {
  generate(db, count) {
    return [...Array(count).keys()].map(() => ({
      name: 'test'
    }));
  }
}

describe('seeder', () => {
  it('must save seed to db', async () => {
    const mongodbSource = new MongoDBSource({
      url: 'mongodb://localhost:27017',// todo: use docker
      dbName: 'test-seeds',
      options: {
        auth: {
          user: 'dev_db_user',
          password: 'testingisgood'
        }
      }
    });

    const peopleSeeder = new SeedJob('users', new MyGenerator(), mongodbSource.collection('users'));

    const seeder = new Seeder();
    seeder.addJob(peopleSeeder, 1);
    const data = await seeder.seed();
    expect(data.users[0].name).to.eql('test');
    expect(data.users[0]).to.haveOwnProperty('_id');
  });
});
