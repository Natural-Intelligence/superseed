const {MockDataGeneratorSchema} = require('../index');
const {expect} = require('chai');

var user = {
  firstName: {
    faker: 'name.firstName'
  },
  lastName: {
    faker: 'name.lastName'
  },
  country: {
    faker: 'address.country'
  },
  createdAt: {
    faker: 'date.past'
  },
  username: {
    function: function () {
      return (
        this.object.lastName.substring(0, 5) +
        this.object.firstName.substring(0, 3) +
        Math.floor(Math.random() * 10)
      )
    }
  }
};

var group = {
  description: {
    faker: 'lorem.paragraph'
  },
  users: [
    {
      function: function () {
        return this.faker.random.arrayElement(this.db.user).username
      },
      length: 10,
      fixedLength: false
    }
  ]
};

describe('MockDataGeneratorSchema test', () => {
  const userGenerator = new MockDataGeneratorSchema('user', user);
  const groupGenerator = new MockDataGeneratorSchema('group', group);
  it('relation ship test', () => {
    const data = [userGenerator.generateMock({} )];
    data.forEach(item => {
      expect(item).to.have.property('firstName');
      expect(item).to.have.property('lastName');
    });

    const groupData = [groupGenerator.generateMock({user: data})];
    groupData.forEach(item => {
      expect(item).to.have.property('users');
      expect(item.users).to.include.members([data[0].username]);
      expect(item).to.have.property('description');
    });
  });

});
