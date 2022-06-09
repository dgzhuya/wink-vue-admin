module.exports = {
	apps: [
		{
			name: 'wink-api',
			script: './dist/main.js',
			env: {
				NODE_ENV: 'production'
			}
		}
	]
}
