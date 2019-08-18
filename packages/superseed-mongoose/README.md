# @superseed/mongoose

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

class CustomSeeded extends DataSource {
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
  id: { skip: true },
  _id: { skip: true }
};

const catOptions = {
  ownerId: {
    generator: 'hasOne',
    target: 'users',
    foreignField:'id'
  },
  fullName: {
    generator:  (db, object) => {
      const {lastName} = db.users.find(({id}) => id === object.ownerId);
      return `${object.name} ${lastName}`
    }
  }
};

const personSeedJob = new SeedJob(
    'users',
    new MongooseMockGenerator(new Schema(userSchema), options),
    new CustomSeeded()
);

const catSeedJob = new SeedJob(
    'cats',
    new MongooseMockGenerator(new Schema(catSchema), catOptions),
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
 
 *  Generation options per field. Where key is the field name and value is an object.
 
    * options.\<fieldName\>.**skip** <boolean>: When set to true would skip the field. No data would be generated for this field.

    * options.<\fieldName\>.**generator** \<String\> or \<function\>. The following generators are supported:
     
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
    
        * *email*: Would generate an email.
        * A *function*: a function that receives as arguments 
          - db: all the seeds created grouped by type
          - object: the current mock object being populated with values
          Another way to access these values is via this.db and this.object. Not that accessing via this would not work for arrow functions.

### generateMock(db, staticField)
  * `db` \<Object\> A plain object where a *key* is the entity key and *value* is an array of entities. Is used 
  * `staticFields` \<Object\> used to define that do not need dynamic data. The provided values would be used.   


# Mongoose versions
 
 | Version | Supported          |
 | ------- | ------------------ |
 | 5.x     | :white_check_mark: |
 | 4.x     | :white_check_mark: |
