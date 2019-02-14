<img src="ni-eng-strip.jpg" alt="NI Engineering">

# super-seed

Smart seed generation

# Packages
This project is split into multiples packages. There 4 types of packages
- Main package ([super-seed](packages/super-seed))
- Core Package ([super-seed-core](packages/super-seed-core))
- Mock Generators
- Data Sources 

# Main Package - super-seed
The main package is super-seed.

# Core Package - super-seed-core
This package stores core entities and would be used mainly by developers wishing to build custom _Mock Generators_ and _Data Sources_.

## Mock Generators
- [super-seed-mocker-data-generator](packages/super-seed-mocker-data-generator): Allow definitions mock generators using [mocker-data-generator](https://www.npmjs.com/package/mocker-data-generator) Schemas.
- [super-seed-mongoose](packages/super-seed-mongoose): Allows Allow definitions mock generators using [mongoose](https://www.npmjs.com/package/mongoose) Schemas.

## Datasources
-  [super-seed-mongodb](packages/super-seed-mongodb): Allows savings seeds to a MongoDb database
- [super-seed-restapi](packages/super-seed-restapi): Allows saving seeds via REST API 

# Development
## Getting started
Running the command below would 
- Bootstrap the packages in the current repo. 
- Install all of their dependencies and links any cross-dependencies.

```bash
lerna bootstrap
```

## Testing
Running tests
```bash
npm run test
```

# TO DO
- eslint
- more tests
- mock generators: mongoose schema (with validatejs support if possible), mock-data-generator
- cli tool
- auto publish 
- API improvement
