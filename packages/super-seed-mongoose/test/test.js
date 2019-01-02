const MongooseMochGenerator = require('../index');
const {expect} = require('chai');

const schema = {
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

const options = {
    ignore:['_id']
};

describe('MongooseMockGenerator test', () => {
  const generator = new MongooseMochGenerator('User', schema, options);
  it('simple test', () => {
    const data = generator.generate({}, 2);
      expect(data.length).to.eql(2);
      data.forEach((item) => {
          expect(item).to.haveOwnProperty('name');
          expect(item).to.haveOwnProperty('email');
          expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
      });
  });
});
