const {describe, it} = require('mocha');
const {expect} = require('chai');


const {Seeder, SeedJob} = require('../');
const {BaseMockGenerator, BaseDataSource} = require('../../superseed-core');

class MyGenerator extends BaseMockGenerator {
  generateMock(db ,fields) {
    return {
      name: fields.name || 'test'
    };
  }
}

class MyDataSource extends BaseDataSource {
  createSeeds(seeds) {
    return seeds;
  }

  deletedSeeds() {
  }
}


describe('SeedJob', () => {
  const job = new SeedJob('entities', new MyGenerator(), new MyDataSource());

  it('must generate using count', async () => {
    const seeder = new Seeder();
    seeder.addJob(job, {count: 10});
    const result = await seeder.seed();
    expect(result.entities.length).to.eql(10)
  });

  it('must generate using staticFields', async () => {
    const seeder = new Seeder();
    seeder.addJob(job, {staticFields: [{name: "Koffi"}, {name: "Moshe"}, {name: "Ahmed"}]});
    const result = await seeder.seed();
    expect(result.entities.length).to.eql(3);
    ['Koffi','Moshe','Ahmed'].forEach((name,index) => {
      expect(result.entities[index].name).to.eql(name);
    });
  });


  it('must generate using getStaticFields', async () => {
    const seeder = new Seeder();
    seeder.addJob(job, {count: 5, getStaticFields:() => ({name: 'static name'})});
    const result = await seeder.seed();
    expect(result.entities.length).to.eql(5);
    result.entities.forEach((entity) => {
      expect(entity.name).to.eql('static name');
    });
  });
});