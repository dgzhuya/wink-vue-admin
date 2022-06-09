module.exports = {
	apps: [
		{
			name: 'wink-api',
			script: './dist/main.js',
			watch: 'true',
			env: {
				NODE_ENV: 'production'
			}
		}
	]
}
