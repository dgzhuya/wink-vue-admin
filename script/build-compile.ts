import { OutputOptions, rollup, RollupBuild, RollupOptions } from 'rollup'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import common from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import { resolve } from 'path'
import alias from '@rollup/plugin-alias'
import { dependencies } from '../packages/compile/package.json'

const external = Object.keys(dependencies)

const targetPath = (fileName: string) => resolve(__dirname, `../packages/compile/${fileName}`)

const configOptions: RollupOptions = {
	input: targetPath('src/index.ts'),
	external,
	plugins: [
		json(),
		nodeResolve(),
		common(),
		terser(),
		ts({
			tsconfig: targetPath('tsconfig.json')
		})
	]
}

const outputOptions: OutputOptions = {
	sourcemap: true,
	file: targetPath('dist/index.js'),
	format: 'cjs'
}

const dtsConfig: RollupOptions = {
	input: targetPath('src/index.ts'),
	plugins: [
		alias({
			entries: [{ find: '@', replacement: targetPath('src') }]
		}),
		dts()
	]
}

const dtsOut: OutputOptions = {
	file: targetPath('dist/index.d.ts'),
	format: 'es'
}

const build = async () => {
	let bundle: RollupBuild | undefined
	let dtsBundle: RollupBuild | undefined
	let bundleFailed = 0
	try {
		bundle = await rollup(configOptions)
		await bundle.write(outputOptions)
		dtsBundle = await rollup(dtsConfig)
		await dtsBundle.write(dtsOut)
	} catch (error) {
		bundleFailed = 1
		console.log('error:', error)
	}
	if (bundle !== undefined && dtsBundle !== undefined) {
		await bundle.close()
		await dtsBundle.close()
	}
	process.exit(bundleFailed)
}

build()
