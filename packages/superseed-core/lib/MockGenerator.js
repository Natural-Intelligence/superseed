class MockGenerator {
  constructor(options  = null){
    if(options) {
      const {generateMock } = options;
      Object.assign(this, { generateCb: generateMock });
    }
  }

  generateMock(db, staticFields = {}) {
    if(this.generateCb){
      return this.generateCb(db, staticFields);
    }
    throw new Error('Unimplemented Method');  }
}


module.exports = MockGenerator;
