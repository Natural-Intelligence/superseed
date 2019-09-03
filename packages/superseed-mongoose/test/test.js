const MongooseMockGenerator = require('../index');
const {expect} = require('chai');
 const mongoose = require('mongoose');
const {Schema} =mongoose;
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
  },
  info: {
    bio: String
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
  _id: {skip: true},
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
  const generator = new MongooseMockGenerator(new Schema(personSchema), options);
  const catGenerator = new MongooseMockGenerator( new Schema(catSchema), catOptions);
  it('should allow both model & schema', () => {
     const schema = new Schema({name: String});
     const model = mongoose.model('thing', schema);
     const options = {__v: {skip: true}, _id: {skip: true}};
    const generator1 = new MongooseMockGenerator( schema,options);
    const generator2 = new MongooseMockGenerator( model, options);
    const [mock1, mock2] = [generator1.generateMock({}, {name: 'test'}), generator2.generateMock({}, {name: 'test'})];
    expect(mock1).to.deep.eql(mock2);
  });

   it('skip', () => {
     const generator = new MongooseMockGenerator(new Schema({name: String, nickname: String}), {nickname: {skip: true}});
     const data = generator.generateMock({});
     expect(data).to.have.property('name');
     expect(data).not.to.have.property('nickname');
   });

  it('simple test', () => {
    const data = [generator.generateMock({})];
    data.forEach(item => {
      expect(item).to.have.property('firstName');
      expect(item).to.have.property('email');
      expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
    });
  });

  it('staticFields test', () => {
    const generator = new MongooseMockGenerator( new Schema(personSchema), options);
    const item = generator.generateMock({}, {firstName: 'name', email: 'test@mail.com'});
    expect(item.firstName).to.eql('name');
    expect(item.email).to.eql('test@mail.com');
    expect(['Male', 'Female'].includes(item.gender)).to.eql(true);
  });

  it('staticFields test - nested', () => {
    const generator = new MongooseMockGenerator(new Schema(personSchema), options);
    const item = generator.generateMock({}, {info:{bio: 'blabla'}});
    expect(item.info.bio).to.eql('blabla');
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
      const generator = new MongooseMockGenerator(new Schema(schema), options);
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
      const generator = new MongooseMockGenerator( new Schema(schema), options);
      const mock = generator.generateMock({});

      expect(mock.names.length > 0).to.eql(true);
      expect(mock.names[0]).to.eql('a');
    });

    it('must handle embedded level', () => {
      const nested = new Schema({name: String});
      const schema = {info: nested};
      const options = {
        "info.name": {
          generator: () => {
            return 'axb';
          }
        }
      };
      const generator = new MongooseMockGenerator( new Schema(schema), options);
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
      const generator = new MongooseMockGenerator( new Schema(schema), options);
      const mock = generator.generateMock({});

      expect(mock.info).to.have.property('name');
    });
  });
});
