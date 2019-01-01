# super-seed

Smart seed generation

# Packages
This project is split into multiples packages. There 4 types of packages
- Main package
- Core Package
- Mock Generators
- Data Sources 

# Main Package - super-seed
The main package is super-seed.

# Core Package - super-seed-core
This package stores core entities and would be used mainly by developers wishing to build custom _Mock Generators_ and _Data Sources_.

## Mock Generators
- super-seed-mocker-data-generator: Allow definitions mock generators using [mocker-data-generator](https://www.npmjs.com/package/mocker-data-generator) Schemas.

## Datasources
- super-seed-mongodb: Allows savings seeds to a MongoDb database
- super-seed-restapi: Allows saving seeds via REST API 

# Development
## Getting started
Running the command below would 
- Bootstrap the packages in the current repo. 
- Install all of their dependencies and links any cross-dependencies.

```bash
lerna boostrap
```

## Testing
Running tests
```bash
npm run test
```

# TO DO
- eslint
- more tests
- mock generators: mongoose schema (with validatejs support idf possible), mock-data-generator
- cli tool
- auto publish 
- API improvement
