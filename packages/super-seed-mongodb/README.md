# super-seed-mongodb
REST API data source for super-seed

# Install
```bash
npm install super-seed-mongodb
```

## Usage example

The Mongo DB data souce allow storage of seeds to MongoDB

*Example:*

```js
const {Seeder, SeedJob} = require('super-seed');
const MongoDBSource = require('super-seed-mongodb');
const {BaseMockGenerator} = require('super-seed-core');

class MyGenerator extends BaseMockGenerator {
  generate(db, count) {
    return [...Array(count).keys()].map(() => ({
      name: 'test'
    }));
  }
}
const peopleSeeder = new SeedJob('users', new MyGenerator(), mongodbSource.collection('users'));

const seeder = new Seeder();
seeder.addJob(peopleSeeder, 1);
const data = await seeder.seed();    
```
