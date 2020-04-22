const userDao = require("../dao/UserDao");

module.exports.save = async function(user) {
    let oldUser = await this.getByUsername(user.username);
    if (oldUser) {
        throw "用户名已存在";
    }
    userDao.create(user);
}

module.exports.deleteById = async function(id) {
    await userDao.destroy({
        where: {
            id: id
        }
    });
}

module.exports.deleteByUsername = async function(username) {
    await userDao.destroy({
        where: {
            username: username
        }
    });
}

module.exports.update = async function(user) {
    if (!user.id) {
        throw "id 不能为空";
    }
    await userDao.update(user, {
        where: {
            id: user.id
        }
    });
}

module.exports.getById = async function(id) {
    return await userDao.findOne({
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

module.exports.getByUsernameAndPassword = async function(username, password) {
    if (!username) {
        throw "用户名不能为空";
    }
    if (!password) {
        throw "密码不能为空";
    }
    return await userDao.findOne({
        where: {
            username: username,
            password: password
        }
    });
}

module.exports.list = async function(page, limit) {
    return await userDao.findAll({
        where: {
            role: "user"
        },
        limit: limit,
        offset: (page - 1) * limit
    });
}

module.exports.count = async function() {
    return await userDao.count();
}
