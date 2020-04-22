const databaseUtil = require("../util/DatabaseUtil");

const sequelize = databaseUtil.sequelize;
const Sequelize = databaseUtil.Sequelize;

const TabDao = sequelize.define("tab", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tabName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'tab_name'
    },
    tabDesc: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'tab_desc'
    },
    createDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        field: 'create_date',
    },
    updateDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'update_date',
    },
}, {
    tableName: "tab",
    freezeTableName: true,
    timestamps: false
});

module.exports = TabDao;
