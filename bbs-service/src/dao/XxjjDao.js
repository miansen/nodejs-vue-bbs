const databaseUtil = require("../util/DatabaseUtil");

const sequelize = databaseUtil.sequelize;
const Sequelize = databaseUtil.Sequelize;

const XxjjDao = sequelize.define("xxjj", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
}, {
    tableName: "xxjj",
    freezeTableName: true,
    timestamps: false
});

module.exports = XxjjDao;
