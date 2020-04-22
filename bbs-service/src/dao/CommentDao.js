const databaseUtil = require("../util/DatabaseUtil");

const sequelize = databaseUtil.sequelize;
const Sequelize = databaseUtil.Sequelize;

const CommentDao = sequelize.define("comment", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'post_id'
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
}, {
    tableName: "comment",
    freezeTableName: true,
    timestamps: false
});

module.exports = CommentDao;
