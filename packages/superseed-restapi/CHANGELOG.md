## v1.1.0 (2019-07-01)

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