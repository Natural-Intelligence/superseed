# super-seed-restapi
REST API data source for super-seed

# Install
```bash
npm install super-seed-restapi
```

## Usage example
```js

const {Seeder, SeedJob} = require('super-seed');
const APISource = require('super-seed-restapi');
const {BaseMockGenerator} = require('super-seed-core');

const myService = new APISource({
  baseURL: 'http://localhost:1234/api/v1',
  responseHandler
});

const myEntity = myService.defineEntity({
  basePath: '/entities',
  name: 'Entity'
});

class MyGenerator extends BaseMockGenerator {
  generate(db, count) {
    return [...Array(count).keys()].map(() => ({
      name: 'test'
    }));
  }
}
const peopleSeeder = new SeedJob('users', new MyGenerator(), myEntity);

const seeder = new Seeder();
seeder.addJob(peopleSeeder, 1);
const data = await seeder.seed();

```