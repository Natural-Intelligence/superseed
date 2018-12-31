module.exports = class SeedJob {
    constructor(key, mockGenerator, seeder){
        this.key = key;
        this.mockGenerator = mockGenerator;
        this.seeder = seeder;
    }
    
    getKey(){
        return this.key;
    }

    generateSeeds(db, count) {
        const data = this.mockGenerator.generate(db, count);
        return data;
    }

    createSeeds(models){
        return this.seeder.createSeeds(models);
    }
}