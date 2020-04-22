const tabDao = require("../dao/TabDao");

module.exports.save = async function(tab) {
    if (!tab.tabName) {
        throw "板块名不能为空";
    }
    let oldTab = await this.getByTabName(tab.tabName);
    if (oldTab) {
        throw "板块名已存在";
    }
    tabDao.create(tab);
}

module.exports.deleteById = async function(id) {
    if (!id) {
        throw "id 不能为空";
    }
    await tabDao.destroy({
        where: {
            id: id
        }
    });
}

module.exports.deleteByTabName = async function(tabName) {
    await tabDao.destroy({
        where: {
            tabName: tabName
        }
    });
}

module.exports.update = async function(tab) {
    if (!tab.id) {
        throw "id 不能为空";
    }
    await tabDao.update(tab, {
        where: {
            id: tab.id
        }
    });
}

module.exports.getById = async function(id) {
    return await tabDao.findOne({
        where: {
            id: id
        }
    });
}

module.exports.getByTabName = async function(tabName) {
    return await tabDao.findOne({
        where: {
            tabName: tabName
        }
    });
}

module.exports.list = async function(page, limit) {
    return await tabDao.findAll({
        limit: limit,
        offset: (page - 1) * limit
    });
}

module.exports.count = async function() {
    return await tabDao.count();
}
