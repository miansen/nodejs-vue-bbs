const postDao = require("../dao/PostDao");
const likeDao = require("../dao/LikerDao");
const commentDao = require("../dao/CommentDao");
const fileDao = require("../dao/FileDao");
const fileService = require("./FileService");
const Sequelize = require("../util/DatabaseUtil").Sequelize;
const Op = Sequelize.Op;

module.exports.save = async function(post) {
    let savePost = await postDao.create(post);
    let files = post.files;
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            file.postId = savePost.id;
            fileService.save(file);
        }
    }
    return savePost;
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
        include: [likeDao, commentDao, fileDao],
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
