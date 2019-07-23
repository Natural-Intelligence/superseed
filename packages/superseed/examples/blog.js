const Chance = require('chance');

const chance = new Chance();
// const {Seeder} = require('@superseed/superseed');
// const {MockGenerator, DataSource} = require('@superseed/core');

const {Seeder} = require('../');
const {MockGenerator, DataSource} = require('../../superseed-core');


const pickRandomItem = (array) => {
  const index = Math.floor(Math.random() * Math.floor(array.length));
  return array[index];
};

// define mock generators

const userGenerator = new MockGenerator({
  generateMock(db, staticFields = {}) {
    const generated = {
      username: chance.word(),
      id: chance.guid()
    };
    return Object.assign(generated, staticFields)
  }
});


const postGenerator = new MockGenerator({
  generateMock(db, staticFields = {}) {
    const generated = {
      title: chance.sentence(),
      body: chance.guid(),
      authorId: pickRandomItem(db.users).id
    };
    return Object.assign(generated, staticFields);
  }
});

const categoryGenerator = new MockGenerator({
  generateMock(db, staticFields = {}) {
    const generated = {
      name: chance.word(),
      id: chance.guid(),
      parentId: db.categories.length ? pickRandomItem(db.categories).id : null
    };
    return Object.assign(generated, staticFields);
  }
});

// define data sources

const userSource = new DataSource({
  createSeeds(seeds) {
    return seeds;
  },
  deleteSeeds(seeds) {
    return seeds;
  }
});

// via extension
class CategorySource extends DataSource {
  createSeeds(seeds) {
    return seeds;
  }

  deleteSeeds(seeds) {
    return seeds;
  }
}

const categorySource = new CategorySource();

const blogSource = new DataSource({
  createSeeds(seeds) {
    return seeds;
  },
  deleteSeeds(seeds) {
    return seeds;
  }
});


(async () => {
  // create new seeder
  const seeder = new Seeder();
  // add a seed job
  seeder.addJob('users', userGenerator, userSource, {count: 2})
    .addJob('articles', postGenerator, blogSource, {count: 3})
    // seed top categories
    .addJob('categories', categoryGenerator, categorySource, {
      staticFieldData: [
        {
          name: 'Health',
          parentId: null
        },
        {
          name: 'Fashion',
          parentId: null
        }
      ]
    })
    // seed child categories (they would use the ID of already seeded top categories as parentId)
    // notice the addSeed here. addJob can be called only once per entity.
    .addSeed('categories', {count: 3});

  // create seeds
  const seededData = await seeder.seed();
  // delete seeds
  await seeder.unseed()
})();
