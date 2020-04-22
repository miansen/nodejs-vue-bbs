const Sequelize = require('sequelize');
const config = require('./dbConfig');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100)
}, {
    timestamps: false,
    freezeTableName: true
});

exports.create = function (data, callback, errorCallback) {
    Pet.create(data).then(callback).catch(errorCallback);
};