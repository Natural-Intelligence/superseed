const MongoClient = require('mongodb');
const { BaseDataSource } = require('super-seed-core');
// const BaseDatasource = require('../BaseDatasource');
function getInserted(insertResult) {
  return insertResult.ops;
}

class MongoDbCollection extends BaseDataSource {
  constructor(dbConfig, collectionName) {
    super();
    this.dbConfig = dbConfig;
    this.collectionName = collectionName;
  }

  async createSeeds(seeds) {
    const {url, dbName, options = {}} = this.dbConfig;
    const client = await MongoClient.connect(
      url,
      options
    );
    const collection = client.db(dbName).collection(this.collectionName);
    const inserted = await collection.insertMany(seeds);
    client.close();
    return getInserted(inserted);
  }

  delete(id) {}
}

module.exports = class MongoDBSource {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  collection(collectionName) {
    return new MongoDbCollection(this.dbConfig, collectionName);
  }
};
