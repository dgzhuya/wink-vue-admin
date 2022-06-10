import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'
import { createSvgIconsPlugin } from './src/plugin/svg-icons/index'

const mixinPath = normalizePath(resolve(__dirname, 'src/style/mixin.scss'))
const variablesPath = normalizePath(resolve(__dirname, 'src/style/variables.scss'))

export default defineConfig({
	server: {
		port: 8080,
		open: true,
		proxy: {
			'/server': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/server/, '')
			},
			'/ws_server': {
				target: 'http://localhost:9527',
				changeOrigin: true,
				ws: true,
				rewrite: path => path.replace(/^\/server/, '')
			}
		}
	},
	preview: {
		proxy: {
			'/server': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/server/, '')
			},
			'/ws_server': {
				target: 'http://localhost:9527',
				changeOrigin: true,
				ws: true,
				rewrite: path => path.replace(/^\/server/, '')
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	build: {
		cssCodeSplit: true
	},
	css: {
		modules: {},
		preprocessorOptions: {
			scss: {
				additionalData: `@import "${mixinPath}";@import "${variablesPath}";`
			}
		},
		postcss: {
			plugins: [
				require('autoprefixer')({
					overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
				})
			]
		}
	},
	plugins: [
		vue(),
		createSvgIconsPlugin({ dir: resolve(__dirname, 'src/icons') }),
		AutoImport({
			dts: resolve(__dirname, 'src/auto-imports.d.ts'),
			imports: ['vue', 'vue-router'],
			resolvers: ElementPlusResolver()
		}),
		Components({
			dirs: [resolve(__dirname, 'src/components'), resolve(__dirname, 'src/layout/components')],
			resolvers: [ElementPlusResolver({ importStyle: true })],
			dts: resolve(__dirname, 'src/components.d.ts'),
			extensions: ['vue'],
			types: [
				{
					from: 'vue-router',
					names: ['RouterLink', 'RouterView']
				}
			]
		})
	]
})
