const {Schema} = require('mongoose');
const {Seeder, SeedJob} =  require('../../superseed'); // require('@superseed/superseed');
const MongooseMockGenerator =   require('../'); //require('@superseed/mongoose');
const {DataSource} = require('@superseed/core');

const ObjectId = Schema.Types.ObjectId;

class CustomSeeder extends DataSource {
  createSeeds(seeds) {
    return seeds;
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
  _id: { skip: true },
  email: { generator: 'email' }
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
  new MongooseMockGenerator(new Schema(personSchema), options),
  new CustomSeeder()
);

const catSeedJob = new SeedJob(
  'cats',
  new MongooseMockGenerator(new Schema(catSchema), catOptions),
  new CustomSeeder()
);

const seeder = new Seeder();
seeder.addJob(personSeedJob, {count: 1})
  .addJob(catSeedJob, {count: 2});
seeder.seed().then(data => {
  console.log(data);
});
