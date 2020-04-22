const Sequelize = require("sequelize");
const dbConfig = require('../config/DatabaseConfig');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    underscored: true,
    timezone: '+08:00',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

const databaseUtil = {
    sequelize: sequelize,
    Sequelize: Sequelize
};

module.exports = databaseUtil;
