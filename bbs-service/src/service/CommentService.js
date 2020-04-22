const commentDao = require("../dao/CommentDao");

module.exports.save = async function(comment) {
    commentDao.create(comment);
}

module.exports.listByPostId = async function(postId) {
    return await commentDao.findAll({
        where: {
            postId: postId
        }
    });
}
