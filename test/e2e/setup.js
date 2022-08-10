const create = require('./server/create');

module.exports = async () => {
    global.__TEST_SERVER__ = await create();
};