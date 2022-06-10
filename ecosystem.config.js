module.exports = {
	apps: [
		{
			name: 'wink-api',
			script: 'packages/api/dist/main.js',
			env: {
				NODE_ENV: 'production',
				WS_KEY: 'ws_key'
			}
		},
		{
			name: 'wink-build',
			script: 'packages/build/src/index.mjs',
			env: {
				NODE_ENV: 'production',
				WS_KEY: 'ws_key'
			}
		}
	]
}
