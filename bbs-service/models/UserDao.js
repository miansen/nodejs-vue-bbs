const sequelize = require("./db").sequelize;
const Sequelize = require("./db").Sequelize;

const UserDao = sequelize.define("user", {
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
        defaultValue: Sequelize.NOW,
        field: 'create_date',
    },
    updateDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'update_date',
    },
}, {
    tableName: "user",
    freezeTableName: true,
    timestamps: false
});

module.exports = UserDao;
