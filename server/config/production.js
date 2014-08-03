var path = require('path');
var serverDir = path.normalize(__dirname + '/..');
var mainDir = path.normalize(__dirname + '/../main');
var rootDir = path.normalize(__dirname + '/../..');
var configDir = path.normalize(__dirname);
var views = path.normalize(serverDir + '/views');
var controllers = path.normalize(serverDir + '/controllers');
var models = path.normalize(serverDir + '/models');
var main = path.normalize(serverDir + '/main');
var client = path.normalize(rootDir + '/client');

module.exports = {
    views: views,
    client: client,
    controllers: controllers,
    models: models,
    mainDir: mainDir,
    serverDir: serverDir,
    env: 'production',
    dir: configDir,
    root: rootDir,
    port: process.env.PORT || 3000,
    db: {
        url: "localhost:27017",
        options: {
            db: {
                safe: true
            }
        }
    }
}