const databaseUtil = require("../util/DatabaseUtil");

const sequelize = databaseUtil.sequelize;
const Sequelize = databaseUtil.Sequelize;

const FileDao = sequelize.define("file", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'post_id'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    tableName: "file",
    freezeTableName: true,
    timestamps: false
});

module.exports = FileDao;
