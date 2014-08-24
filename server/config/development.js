var path = require('path');
rootDir = path.normalize(__dirname + '/../..'),
	client = path.normalize(rootDir + '/client'),
	dist = path.normalize(client + '/dist')

module.exports = {
	env: 'development',
	port: process.env.PORT || 3000,
	staticUrl: '/static',
	client: {
		dev: client,
		dist: dist
	},
	db: {
		url: "mongodb://localhost:27017/data-feed",
		options: {
			db: {
				safe: true
			}
		}
	}
}