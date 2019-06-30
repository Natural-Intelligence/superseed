const hasOne = (db, config) => {
  const {target, foreignField, exclude = [], get, index: itemIndex} = config;
  let entity = null;
  if (exclude.length) {
    var dbString = JSON.stringify(exclude);
    for (var i = 0; i < db[target].length; i++) {
      var item = db[target][i];
      const value = get ? get(item, itemIndex) : foreignField ? item[foreignField] : item;
      if (dbString.indexOf(JSON.stringify(value)) < 0) {
        entity = item;
        break;
      }
    }
    if (entity === null) {
      throw 'Can\u00B4t get unique data. Source "' + target + '" has not enough data';
    }
  } else {
    const index = Math.floor(Math.random() * Math.floor(db[target].length));
    entity = db[target][index];
  }
  return get ? get(entity, itemIndex) : foreignField ? entity[foreignField] : entity;
};

const hasMany = (db, config) => {
  const {target, foreignField, unique, min, max, amount, get} = config;
  let number;
  if (amount) {
    number = amount;
  } else {
    number = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const newConfig = {
    target,
    foreignField,
    get
  };
  if (unique) {
    return Array.from(new Array(number)).reduce((acc, num, index) => {
      return acc.concat([hasOne(db, Object.assign({exclude: acc, index}, newConfig))]);
    }, []);
  }
  return Array.from(new Array(number)).map((num, index) => hasOne(db, Object.assign({index}, newConfig)));
};

module.exports = {
  hasOne,
  hasMany
};
