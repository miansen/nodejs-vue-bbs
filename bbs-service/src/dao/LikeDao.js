const databaseUtil = require("../util/DatabaseUtil");

const sequelize = databaseUtil.sequelize;
const Sequelize = databaseUtil.Sequelize;

const LikeDao = sequelize.define("like", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'post_id'
    }
}, {
    tableName: "like",
    freezeTableName: true,
    timestamps: false
});

module.exports = LikeDao;
