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
    generator: (db, object) => {
      const {lastName} = db.users.find(({id}) => id === object.ownerId);
      return `${object.name} ${lastName}`
    }
  }
};

describe('MongooseMockGenerator test', () => {
  const generator = new MongooseMockGenerator('User', new Schema(personSchema), options);
  const catGenerator = new MongooseMockGenerator('Cat', new Schema(catSchema), catOptions);
  it('simple test', () => {
    const data = [generator.generateMock({})];
    data.forEach(item => {
      expect(item).to.have.property('firstName');
      expect(item).to.have.property('email');
      expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
    });
  });

  it('staticFields test', () => {
    const generator = new MongooseMockGenerator('People', new Schema(personSchema), options);
    const item = generator.generateMock({}, {firstName: 'name', email: 'test@mail.com'});
    expect(item.firstName).to.eql('name');
    expect(item.email).to.eql('test@mail.com');
    expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
  });

  it('hasOne', () => {
    const userData = [generator.generateMock({})];
    const data = [catGenerator.generateMock({users: userData})];
    expect(data[0].fullName).to.eql(`${data[0].name} ${userData[0].lastName}`);
    expect(data[0].ownerId).to.eql(userData[0].id);
  });

  it('email', () => {
    const data = generator.generateMock({});
    const email = data.contact_us;
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
      const mock = generator.generateMock({});

      expect(mock).to.have.property('title');
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
      const mock = generator.generateMock({});

      expect(mock.names.length > 0).to.eql(true);
      expect(mock.names[0]).to.eql('a');
    });
    // mongoose-dummy does not support embedded properties
    it.skip('must handle embedded level', () => {
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
      const mock = generator.generateMock({});

      expect(mock.info).to.have.property('name');
    });

    it('must handle nested level ', () => {
      const schema = {info: {name: String}};
      const options = {
        "info.name": {
          generator: () => {
            return 'axb';
          }
        }
      };
      const generator = new MongooseMockGenerator('Human', new Schema(schema), options);
      const mock = generator.generateMock({});

      expect(mock.info).to.have.property('name');
    });


    //TODO: make this work
    it.skip('must handle nested object in array', () => {
      const schema = {customers: [{name: String}]};
      const options = {
        "customers.name": {
          generator: () => {
            return 'same';
          }
        }
      };
      const generator = new MongooseMockGenerator('CustomersInfo', new Schema(schema), options);
      const mock = generator.generateMock({});
      mock.customers.forEach(customer => {
        expect(customer.name).to.eql('same');
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
      const mock = generator.generateMock({});
      expect(Array.isArray(mock.customers)).to.eql(true);
      mock.customers.forEach(customer => {
        expect(typeof customer).to.eql('string');
      });
    });
  });
});
