# 3.0.0 (2019-08-14)
- Removed mongoose dependency. Package can run with version 4.x and 5.x of mongoose.
- Replaced mongoose-dummy with fakingoose
- Fixed issues [#15](https://github.com/Natural-Intelligence/superseed/issues/15) and [#14](https://github.com/Natural-Intelligence/superseed/issues/14)

**API Changes**
- **Added**: `skip` option was added. See See [issue #15](https://github.com/Natural-Intelligence/superseed/issues/15) 
- **Changed**: constructor  now receives 2 arguments (the modelName argument was removed)
  - model: mongoose model or schema.
  - options
- **Changed**: Array items value generator.
- **Removed**:`ignore` option is removed. See [issue #15](https://github.com/Natural-Intelligence/superseed/issues/15) 
- **Removed**: `phone` and `address` generator are removed. Instead custom generator functions can be used for this. 

Example:

Given the schema and options below
```js
const schema = {customers: [{name: String}]};
const options = {
  "customers": {
     generator: () => {
       return 'same';
    }
  }
};
const generator = new MongooseMockGenerator('Customers', new Schema(schema), options);
const mock = generator.generateMock({});
```
In version 2.x the generator is called for each item in the `customers` array.

In the version 3.x the `options` should be changed to
```js
const options = {
  "customers": {
     generator: () => {
       return ['same'];
    }
  }
};
```

# 2.0.2

Issue fix: https://github.com/Natural-Intelligence/superseed/issues/10

# 2.0.0

Support @superseed/core 2.0.0


# 1.1.0 (2019-06-26)

Added support of custom generator function