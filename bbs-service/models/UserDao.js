var sequelize = require("./index").sequelize;
var Sequelize = require("./index").Sequelize;

var UserDao = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updateDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
}, {
    tableName: "user",
    freezeTableName: true,
    timestamps: false
});

module.exports = UserDao;