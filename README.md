<img src="ni-eng-strip.jpg" alt="NI Engineering">

# super-seed

Smart mock generation and and seed storage

# Features
- Generate mock data using various (Mongoose Schema & More) seed generators. Available mock generators listed [here](#mock-generators).
- Save mock data to you preferred target source (REST API, MongoDB) . Available data sources listed [here](#data-sources).

## [Mock Generators](#mock-generators)
- [@superseed/mocker-data-generator](packages/super-seed-mocker-data-generator): Allows definitions mock generators using [mocker-data-generator](https://www.npmjs.com/package/mocker-data-generator) Schemas.
- [@superseed/mongoose](packages/super-seed-mongoose): Allows definitions mock generators using [mongoose](https://www.npmjs.com/package/mongoose) Schemas.

## [Data Sources](#data-sources)
- [@superseed/mongodb](packages/super-seed-mongodb): Allows savings seeds to a MongoDb database
- [@superseed/restapi](packages/super-seed-restapi): Allows saving seeds via REST API 

# Development

## Packages
This project is split into multiples packages. There 4 types of packages
- Main package ([@superseed/superseed](packages/super-seed))
- Core Package ([@superseed/core](packages/super-seed-core))
- Mock Generators
- Data Sources

### Main Package - [@superseed/superseed](packages/super-seed)
The main package is super-seed.

### Core Package - [@superseed/core](packages/super-seed-core)
This package stores core entities and would be used mainly by developers wishing to build custom _Mock Generators_ and _Data Sources_.

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
