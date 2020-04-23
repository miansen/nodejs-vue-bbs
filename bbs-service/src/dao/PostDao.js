const sequelize = require("../util/DatabaseUtil").sequelize;
const Sequelize = require("../util/DatabaseUtil").Sequelize;

const PostDao = sequelize.define("post", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    tab: {
        type: Sequelize.STRING,
        allowNull: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isTop: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        field: 'is_top',
    },
    date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: "post",
    freezeTableName: true,
    timestamps: false
});

sequelize.authenticate().then(async () => {

    console.log('Connection has been established successfully.');

    const likeDao = require("../dao/LikeDao");
    const commentDao = require("../dao/CommentDao");

    PostDao.hasMany(likeDao);
    PostDao.hasMany(commentDao);

    sequelize.sync({

    }).then(async () => {
        console.log(`Database & tables created!`);
    }).catch(e => {
        console.error('Unable to connect to the database:', e);
    });

});

module.exports = PostDao;
