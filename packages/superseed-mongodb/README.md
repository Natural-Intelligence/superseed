# super-seed-mongodb
REST API data source for super-seed

# Install
```bash
npm install @superseed/mongodb
```

## Usage example

The Mongo DB data source allow storage of seeds to MongoDB

*Example:*

```js
const {Seeder, SeedJob} = require('@superseed/superseed');
const MongoDBSource = require('@superseed/mongodb');
const {BaseMockGenerator} = require('@superseed/core');

class MyGenerator extends BaseMockGenerator {
  generateMock(db, staticFields) {
    return {
     name: 'test'
    }
  }
}

const mongodbSource = new MongoDBSource({
      url: 'mongodb://localhost:27017',
      dbName: 'test-seeds',
      options: {
        auth: {
          user: 'user',
          password: 'password'
        }
      }
});

const peopleSeeder = new SeedJob('users', new MyGenerator(), mongodbSource.collection('users'));

const seeder = new Seeder();
seeder.addJob(peopleSeeder, 1);
const data = await seeder.seed();    
```
