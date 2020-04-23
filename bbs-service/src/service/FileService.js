const fileDao = require("../dao/FileDao");

module.exports.save = async function(file) {
    await fileDao.create(file);
}

module.exports.saveBatch = async function(files) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        await this.save(file);
    }
}
