const hasOne = (db, config) => {
  const {target, foreignField, exclude = []} = config;
  let entity = null;
  if (exclude.length) {
    var dbString = JSON.stringify(exclude);
    for (var i = 0; i < db[target].length; i++) {
      var item = db[target][i];
      if (dbString.indexOf(JSON.stringify(foreignField ? item[foreignField] : item)) < 0) {
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
  return foreignField ? entity[foreignField] : entity;
};

const hasMany = (db, config) => {
  const {target, foreignField, unique, min, max, amount} = config;
  let number;
  if (amount) {
    number = amount;
  } else {
    number = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const newConfig = {
    target,
    foreignField
  };
  if (unique) {
    return Array.from(new Array(number)).reduce(acc => {
      return acc.concat([hasOne(db, Object.assign({exclude: acc}, newConfig))]);
    }, []);
  }
  return Array.from(new Array(number)).map(() => hasOne(db, newConfig));
};

module.exports = {
  hasOne,
  hasMany
};
