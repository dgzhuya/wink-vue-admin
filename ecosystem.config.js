const path = require('path')

module.exports = {
	apps: [
		{
			name: 'wink-api',
			script: 'dist/main.js',
			cwd: path.resolve(__dirname, 'server/'),
			env: {
				NODE_ENV: 'production'
			}
		}
	]
}
