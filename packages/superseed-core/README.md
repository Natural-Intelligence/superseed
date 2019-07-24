# superseed core 

This is package contains core Classes and helpers for defining custom MockGenerators nad DataSources.

# Core classes
## MockGenerator
The base Mock generator class to extend when  defining custom generators.
 
### Creating a custom mock generator

A mock generator must extend the MockGenerator and implement the generate() method. This method generate multiple mocks based on the cound. The 
*Example:*

```js
const {MockGenerator} = require('@supoerseed/core');
 class CustomGenerator extends MockGenerator {
  generateMock(db, staticFields = {}) {
   // generate some mock data
  }
}
const myGenerator = new CustomGenerator();
```

A simpler way is
```js
const myGenerator = new MockGenerator({
  generateMock(db, staticFields = {}) {
    // generate some mock data
  }
});
```

For more examples see [@superseed/mongoose](https://www.npmjs.com/package/@superseed/mongoose) and [@superseed/mocker-data-generator](https://www.npmjs.com/package/@superseed/mocker-data-generator) 

## DataSource
The Mock generator class to extend when defining custom data sources.

### Creating a custom data source
*Example:*

```js
class CustomSource extends DataSource {
    createSeeds(seeds){
       // save seed somewhere
    }
    
    deleteSeeds() {
      // delete seed created earlier 
    }
}
const myCustomSource = new CustomSource();
```

A simplified way 

```js
const myCustomSource = new DataSource({
  createSeeds(seeds) {
    // save seed somewhere
  },
  deleteSeeds() {
    // delete seed created earlier 
  }
});
```

For more examples see [@superseed/mongodb](https://www.npmjs.com/package/@superseed/mongodb) and [@superseed/restapi](https://www.npmjs.com/package/@superseed/restapi) 


# Core generators

- hasMany
- hasOne