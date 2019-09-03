# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.6](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@3.0.5...@superseed/mongoose@3.0.6) (2019-09-03)

**Note:** Version bump only for package @superseed/mongoose





## [3.0.5](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@3.0.4...@superseed/mongoose@3.0.5) (2019-08-18)

**Note:** Version bump only for package @superseed/mongoose





## [3.0.4](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@3.0.3...@superseed/mongoose@3.0.4) (2019-08-18)

**Note:** Version bump only for package @superseed/mongoose





## [3.0.3](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@3.0.2...@superseed/mongoose@3.0.3) (2019-08-18)

**Note:** Version bump only for package @superseed/mongoose





## [3.0.2](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@3.0.1...@superseed/mongoose@3.0.2) (2019-08-18)

**Note:** Version bump only for package @superseed/mongoose





## [3.0.1](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@3.0.0...@superseed/mongoose@3.0.1) (2019-08-18)

**Note:** Version bump only for package @superseed/mongoose





## [3.0.0](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@2.1.0...@superseed/mongoose@3.0.0) (2019-08-18)


### Features
- **Added**: `skip` option was added. See See [issue #15](https://github.com/Natural-Intelligence/superseed/issues/15) 


### Dependency Changes
- Removed mongoose dependency. Package can run with version 4.x and 5.x of mongoose.
- Replaced mongoose-dummy with fakingoose


### Bug fixes
- Fixed issues [#15](https://github.com/Natural-Intelligence/superseed/issues/15) and [#14](https://github.com/Natural-Intelligence/superseed/issues/14)

### BREAKING CHANGES
- **Changed**: constructor  now receives 2 arguments (the modelName argument was removed)
  - model: mongoose model or schema.
  - options
- **Removed**:`ignore` option is removed. See [issue #15](https://github.com/Natural-Intelligence/superseed/issues/15) 
- **Removed**: `phone` and `address` generator are removed. Instead custom generator functions can be used for this. 
- **Changed**: Array items value generator.

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






## [2.1.0](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@2.0.5...@superseed/mongoose@2.1.0) (2019-08-15)


### Features

* **mongoose:** stop using deprecated BaseMockGenerator ([606bc01](https://github.com/Natural-Intelligence/superseed/commit/606bc01))





# [2.0.5](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@2.0.4...@superseed/mongoose@2.0.5) (2019-08-15)

**Note:** Version bump only for package @superseed/mongoose




## 2.0.4 - 2.0.4 (2019-08-15)

**Note:** Version bump only for package @superseed/mongoose



## 2.0.2

Issue fix: https://github.com/Natural-Intelligence/superseed/issues/10



## 2.0.0

Support @superseed/core 2.0.0



## 1.1.0 (2019-06-26)

Added support of custom generator function
