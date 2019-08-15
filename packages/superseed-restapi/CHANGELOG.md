# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.4](https://github.com/Natural-Intelligence/superseed/compare/@superseed/restapi@1.1.3...@superseed/restapi@1.1.4) (2019-08-15)

**Note:** Version bump only for package @superseed/restapi





## [1.1.3](https://github.com/Natural-Intelligence/superseed/compare/@superseed/restapi@1.1.2...@superseed/restapi@1.1.3) (2019-08-15)

**Note:** Version bump only for package @superseed/restapi





## 1.1.1 - 1.1.2 (2019-08-15)

**Note:** Version bump only for package @superseed/restapi

## 1.1.0 (2019-07-01)

Added option for defining idField for models
Example
```js
const APISource = require('@superseed/restapi');

const myService = new APISource({
  baseURL: 'http://localhost:1234/api/v1',
  responseHandler: (response) => response.content
});

const myEntity = myService.defineEntity({
  basePath: '/entities',
  name: 'Entity',
  idField: 'entityId'
});
```
