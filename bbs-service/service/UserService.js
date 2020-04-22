const userDao = require("../models/UserDao");

module.exports.save = async function(user) {
    let oldUser = await this.getByUsername(user.username);
    if (oldUser) {
        throw "用户名已存在";
    }
    userDao.create(user);
}

module.exports.deleteById = function(id) {
    userDao.destory({
        where: {
            id: id
        }
    });
}

module.exports.deleteByUsername = function(username) {
    userDao.destory({
        where: {
            username: username
        }
    });
}

module.exports.update = function(user) {
    if (!user.id) {
        throw "id 不能为空";
    }
    userDao.update(user, {
        where: {
            id: user.id
        }
    });
}

module.exports.getById = function(id) {
    return userDao.findOne({
        where: {
            id: id
        }
    });
}

module.exports.getByUsername = async function(username) {
    return await userDao.findOne({
        where: {
            username: username
        }
    });
}

module.exports.getByUsernameAndPassword = function(username, password) {
    return userDao.findOne({
        where: {
            username: username,
            password: password
        }
    });
}

module.exports.list = function(page, limit) {
    return userDao.findAll({
        where: {
            role: "user"
        },
        limit: limit,
        offset: (page - 1) * limit
    });
}

module.exports.count = function() {
    return userDao.count();
}
