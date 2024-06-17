const path = require('path')

console.log(path.resolve(__dirname, 'packages/api/'))

module.exports = {
	apps: [
		{
			name: 'wink-api',
			script: 'dist/main.js',
			cwd: path.resolve(__dirname, 'packages/api/'),
			env: {
				NODE_ENV: 'production'
			}
		}
	]
}
