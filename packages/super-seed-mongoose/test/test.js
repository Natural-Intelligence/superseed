const MongooseMochGenerator = require('../index');
const {expect} = require('chai');
const {
  Schema: {
    Types: {ObjectId}
  }
} = require('mongoose');

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
  concact_us: {
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
  ignore: ['_id', 'id'],
  concact_us: {generator: 'email'}
};

const catOptions = {
  ownerId: {
    generator: 'hasOne',
    target: 'users',
    foreignField: 'id'
  }
};

describe('MongooseMockGenerator test', () => {
  const generator = new MongooseMochGenerator('User', personSchema, options);
  const catGenerator = new MongooseMochGenerator('Cat', catSchema, catOptions);
  it('simple test', () => {
    const data = generator.generate({}, 2);
    expect(data.length).to.eql(2);
    data.forEach(item => {
      expect(item).to.haveOwnProperty('name');
      expect(item).to.haveOwnProperty('email');
      expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
    });
  });

  it('hasOne', () => {
    const userData = generator.generate({}, 1);
    const data = catGenerator.generate({users: userData}, 1);
    expect(data.length).to.eql(1);
    expect(data[0].ownerId).to.eql(userData[0].id);
  });

  it('email', () => {
    const data = generator.generate({}, 1);
    expect(data.length).to.eql(1);
    expect(data[0].concact_us.test(`[\w]+@[\w]`)).to.eql(true);
  });
});
