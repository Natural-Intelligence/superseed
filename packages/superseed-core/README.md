# superseed core 

This is package contains core Classes and helpers for defining custom MockGenerators nad DataSources.

# Core classes
## BaseMockGenerator
The base Mock generator class to extend when  defining custom generators.
 
### Creating a custom mock generator

A mock generator must extend the BaseMockGenerator and implement the generate() method. This method generate multiple mocks based on the cound. The 
*Example:*

```js
const {BaseMockGenerator} = require('@supoerseed/core');
 class CustomGenerator extends BaseMockGenerator {
  generate(db, count) {
   // generate some mock data
  }
}
```

For more examples see [@superseed/mongoose](https://www.npmjs.com/package/@superseed/mongoose) and [@superseed/mocker-data-generator](https://www.npmjs.com/package/@superseed/mocker-data-generator) 

## BaseDataSource
The base Mock generator class to extend when  defining custom data sources.

### Creating a custom data source
*Example:*

```js
class CustomSource extends BasedataSource {
    createSeeds(seeds){
       // save seed somewhere
    }
    
    deleteSeeds() {
      // delete seed created earlier 
    }P
}
```

For more examples see [@superseed/mongodb](https://www.npmjs.com/package/@superseed/mongodb) and [@superseed/restapi](https://www.npmjs.com/package/@superseed/restapi) 


# Core generators

- hasMany
- hasOne