var userDao = require("../models/UserDao");

module.exports.save = async function (username, password, nickname, role) {
    let user = {
        username: username,
        password: password,
        nickname: nickname,
        role: role,
        createDate: new Date()
    };
    await userDao.create(user);
}

module.exports.getById = function (id) {
    return userDao.findOne({
        where: {
            id: id
        }
    });
}