const { createServer } = require('http-server')
const path = require('path')

module.exports = async () => {
    const root = path.resolve(__dirname, './content');
    const server = createServer({
        root
    });
    await new Promise((res) => {
        server.listen({
            port: 8080
        }, res)
    });
    console.log('test pages server is listening...')
    return server;
};