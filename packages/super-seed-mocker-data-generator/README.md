# super-seed-mocker-data-generator

A super-seed module that allows support for MochGenerators using [mocker-data-generator](https://www.npmjs.com/package/mocker-data-generator) schema

# Install

```bash
npm install super-seed-mocker-data-generator
```

# Usage

_Example:_

```js
const {Seeder, SeedJob} = require('super-seed');
const MockSchema = require('super-seed-mocker-data-generator');

class CustomSeeded extends BasedataSource {
    createSeeds(seeds) {
        // save seed somewhere
    }
}

const person = {
    firstName: {
        chance: 'word'
    },
    lastName: {
        chance: 'word'
    }
};

const cat = {
    name: {
        chance: 'word'
    },
    ownerId: {
        hasOne: 'users',
        get: '_id'
    }
};

const peopleSeeder = new SeedJob(
    'users',
    new MockSchema(user),
    new CustomSeeded()
);

const catSeeder = new SeedJob('cats', new MockSchema(cat), new CustomSeeded());

const seeder = new Seeder();
seeder.addSeed(peopleSeeder, 1).addSeed(catSeeder, 2);
seeder.seed().then(data => {
    console.log(data);
});
```
