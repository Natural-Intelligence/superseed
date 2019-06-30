# superseed mocker-data-generator

A super-seed module that allows support for MockGenerators using [mocker-data-generator](https://www.npmjs.com/package/mocker-data-generator) schema

# Install

```bash
npm install @superseed/mocker-data-generator
```

# Usage

_Example:_

```js
const {Seeder, SeedJob} = require('@super-seed/superseed');
const MockSchema = require('@superseed/mocker-data-generator');

class CustomSeeded extends BasedataSource {
    createSeeds(seeds) {
        // save seed somewhere
    }
}

// sample from mocker-data-generator
const person = {
    firstName: {
        faker: 'name.firstName'
    },
    lastName: {
        faker: 'name.lastName'
    },
    country: {
        faker: 'address.country'
    },
    createdAt: {
        faker: 'date.past'
    },
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
seeder.addJob(peopleSeeder, 1).addJob(catSeeder, 2);
seeder.seed().then(data => {
    console.log(data);
});
```
