# @superseed/restapi
REST API data source for [superseed](https://www.npmjs.com/package/@superseed/superseed)

# Install
```bash
npm i @superseed/restapi
```

## Usage example
```js

const {Seeder, SeedJob} = require('@superseed/superseed');
const APISource = require('@superseed/restapi');
const {BaseMockGenerator} = require('@superseed/core');

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