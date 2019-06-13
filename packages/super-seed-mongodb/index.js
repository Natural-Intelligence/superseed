const MongoClient = require('mongodb');
const { BaseDataSource } = require('@superseed/core');

function getInserted(insertResult) {
  return insertResult.ops;
}

class MongoDbCollection extends BaseDataSource {
  constructor(dbConfig, collectionName) {
    super();
    this.dbConfig = dbConfig;
    this.collectionName = collectionName;
  }


  async getCollection (){
    const {url, dbName, options = {}} = this.dbConfig;
    const client = await MongoClient.connect(
      url,
      options
    );
    const collection = client.db(dbName).collection(this.collectionName);
    return {client, collection}
  }

  async createSeeds(seeds) {
    const {client, collection} = await this.getCollection();

    const inserted = await collection.insertMany(seeds);
    client.close();
    return getInserted(inserted);
  }

  async deleteSeeds(seeds) {
    const {client, collection} = await this.getCollection();
    const seedIds = seeds.map(({_id: id}) => id);
    await collection.deleteMany({_id: {$in: seedIds}});
    client.close();
  }
}

module.exports = class MongoDBSource {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  collection(collectionName) {
    return new MongoDbCollection(this.dbConfig, collectionName);
  }
};
