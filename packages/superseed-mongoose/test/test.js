const MongooseMockGenerator = require('../index');
const {expect} = require('chai');
const {Schema} = require('mongoose');
const {
  Types: {ObjectId}
} = Schema;

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
  contact_us: {
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
  contact_us: {generator: 'email'}
};

const catOptions = {
  ownerId: {
    generator: 'hasOne',
    target: 'users',
    foreignField: 'id'
  },
  fullName: {
    generator:  (db, object) => {
      const {lastName} = db.users.find(({id}) => id === object.ownerId);
      return `${object.name} ${lastName}`
    }
  }
};

describe('MongooseMockGenerator test', () => {
  const generator = new MongooseMockGenerator('User', new Schema(personSchema), options);
  const catGenerator = new MongooseMockGenerator('Cat', new Schema(catSchema), catOptions);
  it('simple test', () => {
    const data = generator.generate({}, 2);
    expect(data.length).to.eql(2);
    data.forEach(item => {
      expect(item).to.have.property('name');
      expect(item).to.have.property('email');
      expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
    });
  });

  it('hasOne', () => {
    const userData = generator.generate({}, 1);
    const data = catGenerator.generate({users: userData}, 1);
    expect(data.length).to.eql(1);
    expect(data[0].fullName).to.eql(`${data[0].name} ${userData[0].lastName}`);
    expect(data[0].ownerId).to.eql(userData[0].id);
  });

  it('email', () => {
    const data = generator.generate({}, 1);
    expect(data.length).to.eql(1);
    const email = data[0].contact_us;
    expect(/[\w]+\@[\w]+.[\w]+/.test(email)).to.eql(true);
  });

  describe('custom generator', () => {
    it('must handle top level', () => {
      const schema = {title: String};
      const options = {
        title: {
          generator: () => {
            return 'axb';
          }
        }
      };
      const generator = new MongooseMockGenerator('Person', new Schema(schema), options);
      const [mock] = generator.generate({}, 1);

      expect(mock).to.have.property('title');
      console.log(mock);
    });

    it('must handle top level array', () => {
      const schema = {names: [{type: String, min: 2, max: 5}]};
      const names = ['a', 'b', 'c'];
      let i = -1;
      const options = {
        names: {
          generator: () => {
            i++;
            return names[i];
          }
        }
      };
      const generator = new MongooseMockGenerator('NameList', new Schema(schema), options);
      const [mock] = generator.generate({}, 1);

      expect(mock.names.length > 0).to.eql(true);
      expect(mock.names[0]).to.eql('a');
      console.log(mock);
    });
    // mongoose-dummy does not support embedded properties
    it.skip('must handle nested level', () => {
      const nested = new Schema({name: String});
      const schema = {info: nested};
      const options = {
        "info.name": {
          generator: () => {
            return 'axb';
          }
        }
      };
      const generator = new MongooseMockGenerator('Person', new Schema(schema), options);
      const [mock] = generator.generate({}, 1);

      expect(mock.info).to.have.property('name');
    });

    it('must handle nested object in array', () => {
      const nested = new Schema({name: String});
      const schema = {customers: [nested]};
      const options = {
        "customers.name": {
          generator: () => {
            return 'axb';
          }
        }
      };
      const generator = new MongooseMockGenerator('CustomersInfo', new Schema(schema), options);
      const mocks = generator.generate({}, 2);
      mocks.forEach(mock => {
        mock.customers.forEach(customer => {
          expect(customer).to.have.property('name');
        });
      });
    });
    it('must handle nested string in array', () => {
      const schema = {customers: [{type: String}]};
      const options = {
        "customers": {
          generator: () => {
            return 'axb';
          }
        }
      };
      const generator = new MongooseMockGenerator('CustomerNames', new Schema(schema), options);
      const mocks = generator.generate({}, 2);
      mocks.forEach(mock => {
        expect(Array.isArray(mock.customers)).to.eql(true);
        mock.customers.forEach(customer => {
          expect(typeof customer).to.eql('string');
        });
      });
    });
  });
});
