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
    let where = {};
    if (query.username) {
        where.username = query.username;
    }
    if (query.tab) {
        where.tab = query.tab;
    }
    if (query.title) {
        where.title = {
            [Op.like]:'%' + query.title + '%'
        }
    }
    return await postDao.findAll({
        where: where,
        order: [
            ["isTop", "DESC"],
            ["date", "DESC"]
        ],
        limit: limit,
        offset: (page - 1) * limit
    });
}

module.exports.count = async function(query) {
    let where = {};
    if (query.username) {
        where.username = query.username;
    }
    if (query.tab) {
        where.tab = query.tab;
    }
    if (query.title) {
        where.title = {
            [Op.like]:'%' + query.title + '%'
        }
    }
    return await postDao.count({
        where: where
    });
}
