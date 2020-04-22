const xxjjDao = require("../dao/XxjjDao");

module.exports.update = async function(xxjj) {
    if (!xxjj.id) {
        throw "id 不能为空";
    }
    await xxjjDao.update(xxjj, {
        where: {
            id: xxjj.id
        }
    });
}

module.exports.getById = async function(id) {
    if (!id) {
        throw "id 不能为空";
    }
    return await xxjjDao.findOne({
        where: {
            id: id
        }
    });
}
