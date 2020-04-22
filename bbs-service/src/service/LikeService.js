const likeDao = require("../dao/LikeDao");

module.exports.save = async function(like) {
    likeDao.create(like);
}

module.exports.listByPostId = async function(postId) {
    return await likeDao.findAll({
        where: {
            postId: postId
        }
    });
}
