# super-seed-mongoose

A super-seed module that allows support for MochGenerators using [mongoose](https://www.npmjs.com/package/mongoose) schema

# Install

```bash
npm install @superseed/mongoose
```

# Usage 

_Example:_

```js
const {Seeder, SeedJob} = require('@superseed/superseed');
const MongooseMockGenerator = require('@superseed/mongoose');

class CustomSeeded extends BasedataSource {
    createSeeds(seeds) {
        // save seed somewhere
    }
}
const personSchema = {
  id: ObjectId,
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String
  },
  birth_date: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  }
};

const catSchema = {
  id: ObjectId,
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  ownerId: ObjectId
};

const options = {
  ignore: ['_id', 'id']
};

const catOptions = {
  ownerId: {
    generator: 'hasOne',
    target: 'users',
    foreignField:'id'
  }
};

const personSeedJob = new SeedJob(
    'users',
    new MongooseMockGenerator('User', userSchema, options),
    new CustomSeeded()
);

const catSeedJob = new SeedJob(
    'cats',
    new MongooseMockGenerator('Cat', catSchema, catOptions),
    new CustomSeeded()
);

const seeder = new Seeder();
seeder.addJob(personSeedJob, 1)
.seeder.addJob(catSeedJob, 2);
seeder.seed().then(data => {
    console.log(data);
});
```

# Documentation

## Methods
### constructor(ModelName, mongooseSchema, options)
 * ModelName: Used when a creating a mongoose model.
 * mongooseSchema: A mongoose schem
 * options: defines options per field. An otion for a field must have at least one property, *generator*. The following generators are supported:
     
    * *hasOne*:
        
        * _target_: target entity
        * _foreignField_: target field

    * *hasMany*:
        
        * _target_: target entity
        * _foreignField_: target field
        * _unique_: If the target entity must be unique
        * min: Minimum number of entities
        * max: Minimum number of entities
        * amount: a fixed

    * _email_
    * _phone_


