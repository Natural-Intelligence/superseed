# superseed

Smart seeder for NodeJS. This seeder is mock generator and data source agnostic. So you can plug and play with different mock generators and data sources.  

### Audience
This package is for NodeJs users that require a simple but flexible Seeder package. This seeder was started because of the need for a flexible seeder while writing End to End and Integration tests.    

### Features

- Define custom mock per entity. Existing mock generators include (@superseed/mocker-data-generator)[https://www.npmjs.com/package/@superseed/mocker-data-generator] and (@superseed/mongoose)[https://www.npmjs.com/package/@superseed/mongoose]
- Define custom data sources to feed you project need. Existing data source packages include [@superseed/mongodb](https://www.npmjs.com/package/@superseed/mongodb) and  [@superseed/restapi](https://www.npmjs.com/package/@superseed/restapi)

- User data of related entities when generating seeds.

# Install

```
npm i @superseed/superseed
```

# Usage example (blog seeds)

```js
const chance = new Chance();
const {Seeder} = require('@superseed/superseed');
const {MockGenerator, DataSource} = require('@superseed/core');


const randomItem = (array) => {
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
      authorId: randomItem(db.users).id
    };
    return Object.assign(generated, staticFields);
  }
});

const categoryGenerator = new MockGenerator({
  generateMock(db, staticFields = {}) {
    const generated = {
      name: chance.word(),
      id: chance.guid(),
      parentId: db.categories.length ? randomItem(db.categories).id : null
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
    // remove seeds from storage
  }
});

// via extension
class CategorySource extends DataSource {
  createSeeds(seeds) {
    return seeds;
  }

  deleteSeeds(seeds) {
    return seeds;
    // remove seeds from storage
  }
}

const categorySource = new CategorySource();

const blogSource = new DataSource({
  createSeeds(seeds) {
    return seeds;
  },
  deleteSeeds(seeds) {
    return seeds;
    // remove seeds from storage
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
      staticFieldData: [{
        name: 'Health',
        parentId: null
      }, {name: 'Fashion', parentId: null}]
    })
    // seed child categories (they would use the ID of already seeded top categories as parentId)
    // notice the addSeed here. addJob can be called only once per entity.
    .addSeed('categories', {count: 3});

// create seeds
  const seededData = await seeder.seed();
// delete seeds
  await seeder.unseed()
})();
```
Sample Output from previous seed

```json
{
  "users": [
    {
      "username": "gug",
      "id": "b9e2e3ab-2e71-5b1e-8bdc-dfb7a3f3aa2c"
    },
    {
      "username": "ot",
      "id": "f6962df5-aeb6-595c-a37b-b170965e13ea"
    }
  ],
  "articles": [
    {
      "title": "dut",
      "body": "3f314642-183c-52a0-818e-c5a55ffb3487",
      "authorId": "b9e2e3ab-2e71-5b1e-8bdc-dfb7a3f3aa2c"
    },
    {
      "title": "hezuwi",
      "body": "bb27d17e-40eb-5bdb-9457-e82e5fbb6feb",
      "authorId": "b9e2e3ab-2e71-5b1e-8bdc-dfb7a3f3aa2c"
    },
    {
      "title": "usaak",
      "body": "465f5b30-89ad-586e-998a-9299563baceb",
      "authorId": "f6962df5-aeb6-595c-a37b-b170965e13ea"
    }
  ],
  "categories": [
    {
      "name": "Health",
      "id": "925bd0d5-1a47-5fbe-a09c-f35c4e0bc818",
      "parentId": null
    },
    {
      "name": "Fashion",
      "id": "a61a7b8b-deca-5897-953c-ffd9b592362d",
      "parentId": null
    },
    {
      "name": "zo",
      "id": "ad8d647c-62fe-51f7-8c04-c94c671fdeab",
      "parentId": "925bd0d5-1a47-5fbe-a09c-f35c4e0bc818"
    },
    {
      "name": "dih",
      "id": "905a03e4-b821-5c89-9623-5301aa93153b",
      "parentId": "925bd0d5-1a47-5fbe-a09c-f35c4e0bc818"
    },
    {
      "name": "damom",
      "id": "e7949fb6-8918-5c6a-a7a1-2c0145680acb",
      "parentId": "a61a7b8b-deca-5897-953c-ffd9b592362d"
    }
  ]
}
```


# Mock Generators
Mock generators generate mock data for seed.
The mock generators below can be used when creating seed
- [@superseed/mocker-data-generator](https://www.npmjs.com/package/@superseed/mocker-data-generator): Generate seeds based on (mocker-data-generator)[https://www.npmjs.com/package/mocker-data-generator] Schema.
- [@superseed/mongoose](https://www.npmjs.com/package/@superseed/mongoose): Generate seeds based on  (mongoose)[https://www.npmjs.com/package/mongoose] schema. 

## Creating custom Mock generators
*Example:*
```js
const {MockGenerator} = require('@superseed/core');

class MyGenerator extends MockGenerator {
  generateMock(db, staticFields) {
    return {
      name: 'test'
    };
  }
}

const myGenerator = new MyGenerator();
```

Or Simplified construction

```js
const {MockGenerator} = require('@superseed/core');

const myGenerator = new MockGenerator({
      generateMock(db, staticFields) {
        return {
          name: 'test'
        };
      }
    });
```

# Data Sources

Data sources define the target source for the data generated by seeds.
Available datasources
- [@superseed/mongodb](https://www.npmjs.com/package/@superseed/mongodb): Allows saving of seeds to MpngoDB.
- [@superseed/restapi](https://www.npmjs.com/package/@superseed/restapi): Allows saving seeds via REST API.

## Creating custom Data Sources
*Example:*
```js
const {DataSource} = require('@superseed/core');

class MyDataSource extends DataSource {
  createSeeds(seeds) {
    // save seed
  }
  deleteSeeds() {
    // delete seed. 
    // NOTE: a reference to seeds created must be kept for later deletion 
  }
}

const myDataSource = new MyDataSource();
```

Or Simplified construction 

```js
const {DataSource} = require('@superseed/core');

const myDataSource = new DataSource({
  createSeeds(seeds) {
    // save seed
  },
  deleteSeeds(seeds) {
    // delete seed. 
  }
});
````

# Methods

### constructor(db, options)
Arguments
 * `db` \<Object\> Original db
 * `options` \<Object\>
   * `errorHandler` \<function\> A function for handling errors. Receives and exception as first argument
 
### addJob (seedJob)
Defines a seed job type for an entity and add a seed job.
Arguments
 * `seedJob` \<SeedJob\> a seed job defined with SeedJob class

Calling `seeder.addJob(seedJob)` Is the same as 

```js
seeder.defineJob(seedJob.getKey(), seedJob)
.addSeed(seedJob.getKey(), options)
```

### addSeed(entityKey, options)
Add a seed for a entity. Must be called after a seed job is defined for than entity key.
Arguments 
* `entityKey` \<String\> the key identifying the target entity.
* `options` \<Object\> 
  * `count` \<number\>
  * `staticFieldData` \<Array\>  Define Static data for seed. If supplied count is ignored.
  * `getStaticFieldData` \<function\> A callback that returns static data for seed. If supplied count is ignored. Is called per  seed job.
  * `geStaticFields` \<function\> (with count) A callback that returns static data per mock. Is called per mock.

### defineJob(entityKey, seedJob)
Define a seed job handler for an entity. When creating seeds this job is used to creating seeds
 
 
# Advanced seed Jobs examples
When adding a seed job to a seed the following option values can be used

## count
Define the number of seeds to create.
```js
// Example
seeder.addJob(job, {count: 2});
seeder.seed();// would generate 2 mock
```

## staticFieldData
Define Static data for seed. If supplied count is ignored.
```js
// Example:
seeder.addJob(job, {staticFieldData: [{name: 'John'}, {name: 'Moshe'}]});
seeder.seed();// would generate 2 mock object with names John and Moshe respectively
```

## getStaticFieldData
A callback that returns static data for seed. If supplied count is ignored. Is called per  seed job.
```js
// Example:
seeder.addJob(job, {getStaticFieldData: () => [{name: 'John'}, {name: 'Moshe'}]});
seeder.seed();// would generate 2 mock object with names John and Moshe respectively
```

## geStaticFields (with count)
A callback that returns static data per mock. Is called per mock.
```js
// Example:
seeder.addJob(job, {count: 2, geStaticFields: (db) => ({name: db.users[0].name}) });
seeder.seed();// would generate 2 mock object with names generated by the geStaticFields callback
```
 