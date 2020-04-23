const databaseUtil = require("../util/DatabaseUtil");

const sequelize = databaseUtil.sequelize;
const Sequelize = databaseUtil.Sequelize;

const LikerDao = sequelize.define("liker", {
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
    tableName: "liker",
    freezeTableName: true,
    timestamps: false
});

module.exports = LikerDao;
