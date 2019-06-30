# super-seed-mongoose

A super-seed module that allows support for MockGenerators using [mongoose](https://www.npmjs.com/package/mongoose) schema

# Install

```bash
npm install @superseed/mongoose
```

# Usage 

_Example:_

```js
const {Schema} = require('mongoose');
const {Seeder, SeedJob} = require('@superseed/superseed');
const MongooseMockGenerator = require('@superseed/mongoose');

class CustomSeeded extends BasedataSource {
    createSeeds(seeds) {
        // save seed somewhere
    }
}
const personSchema = {
  id: ObjectId,
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }, 
  lastName: {
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
  fullName: String,
  ownerId: ObjectId
};

const options = {
  ignore: ['_id', 'id'],  
};

const catOptions = {
  ownerId: {
    generator: 'hasOne',
    target: 'users',
    foreignField:'id'
  },
  fullName: function(db, object)  {
      const {lastName} = db.users.find(({id}) => id === object.ownerId);
      return `${object.name} ${lastName}`
    }
};

const personSeedJob = new SeedJob(
    'users',
    new MongooseMockGenerator('User', new Schema(userSchema), options),
    new CustomSeeded()
);

const catSeedJob = new SeedJob(
    'cats',
    new MongooseMockGenerator('Cat', new Schema(catSchema), catOptions),
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
 * mongooseSchema: A mongoose schema
 * options: defines options per field. An option for a field must have at least one property, *generator*. The following generators are supported:
     
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
    * a function: a function that receives as arguments 
      - db: all the seeds created grouped by type
      - object: the current mock object being populated with values
      Another way to access these values is via this.db and this.object. Not that accessing via this would not work for arrow functions.


