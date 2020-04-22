const postDao = require("../dao/PostDao");
const Sequelize = require("../util/DatabaseUtil").Sequelize;
const Op = Sequelize.Op;

module.exports.save = async function(post) {
    postDao.create(post);
}

module.exports.deleteById = async function(id) {
    await postDao.destroy({
        where: {
            id: id
        }
    });
}

module.exports.update = async function(post) {
    if (!post.id) {
        throw "id 不能为空";
    }
    await postDao.update(post, {
        where: {
            id: post.id
        }
    });
}

module.exports.getById = async function(id) {
    return await postDao.findOne({
        where: {
            id: id
        }
    });
}

module.exports.list = async function(query, page, limit) {
    return await postDao.findAll({
        where: {
            username: query.username,
            tab: query.tab,
            title: {
                [Op.like]:'%' + query.title + '%'
            }
        },
        order: [
            ["isTop", "DESC"],
            ["date", "DESC"]
        ],
        limit: limit,
        offset: (page - 1) * limit
    });
}

module.exports.count = async function(query) {
    return await postDao.count({
        where: {
            username: query.username,
            tab: query.tab,
            title: {
                [Op.like]:'%' + query.title + '%'
            }
        }
    });
}
