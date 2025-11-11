// models/index.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_URI || process.env.DB_CONNECTION || 'postgres://postgres:postgres@localhost:5432/farmdb', {
  dialect: 'postgres',
  logging: false,
});

const db = { sequelize, Sequelize };

// load model files (assumes files like farmers.js, buyers.js, listings.js exist)
const files = fs.readdirSync(__dirname).filter(f => f !== 'index.js' && f.endsWith('.js'));
for (const file of files) {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Associations (based on your models)
if (db.Listings && db.Farmers) {
  db.Listings.belongsTo(db.Farmers, { foreignKey: 'seller_id', as: 'seller' });
  db.Farmers.hasMany(db.Listings, { foreignKey: 'seller_id', as: 'listings' });
}
if (db.Demands && db.Buyers) {
  db.Demands.belongsTo(db.Buyers, { foreignKey: 'buyer_id', as: 'buyer' });
  db.Buyers.hasMany(db.Demands, { foreignKey: 'buyer_id', as: 'demands' });
}
if (db.Matches && db.Listings) {
  db.Matches.belongsTo(db.Listings, { foreignKey: 'listing_id', as: 'listing' });
}
if (db.Matches && db.Demands) {
  db.Matches.belongsTo(db.Demands, { foreignKey: 'demand_id', as: 'demand' });
}
if (db.Transactions && db.Matches) {
  db.Transactions.belongsTo(db.Matches, { foreignKey: 'match_id', as: 'match' });
}

module.exports = db;
