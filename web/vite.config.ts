import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve, posix } from 'path'
import autoprefixer from 'autoprefixer'
import { createSvgIconsPlugin } from './src/plugin/svg-icons/index'

function normalizePath(inputPath: string) {
	return posix.normalize(inputPath).replace(/\\/g, '/')
}

const mixinPath = normalizePath(resolve(__dirname, 'src/style/mixin.scss'))
const variablesPath = normalizePath(resolve(__dirname, 'src/style/variables.scss'))

export default defineConfig({
	server: {
		port: 8080,
		proxy: {
			'/api_server': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api_server/, '')
			}
		}
	},
	preview: {
		proxy: {
			'/api_server': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api_server/, '')
			}
		}
	},
	resolve: {
		alias: {
			'@web': resolve(__dirname, 'src')
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
				autoprefixer({
					overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
				})
			]
		}
	},
	plugins: [
		vueSetupExtend(),
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
