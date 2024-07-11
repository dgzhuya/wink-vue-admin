import { Plugin, normalizePath } from 'vite'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const createSvgIconsPlugin = (opt: { dir: string; customDomId?: string }): Plugin => {
	if (opt.customDomId === undefined) {
		opt.customDomId = '__svg_dom__'
	}

	const XMLNS = 'http://www.w3.org/2000/svg'
	const XMLNS_LINK = 'http://www.w3.org/1999/xlink'
	const TURGER_PATH = 'plugin/svg-icons/virtual.ts'

	const cache: Record<string, string> = {}

	const createModuleCode = async () => {
		const html = await compilerIcons()
		const code = `if (typeof window !== 'undefined') {
			function loadSvg() {
			  var body = document.body;
			  var svgDom = document.getElementById('${opt.customDomId}');
			  if(!svgDom) {
				svgDom = document.createElementNS('${XMLNS}', 'svg');
				svgDom.style.position = 'absolute';
				svgDom.style.width = '0';
				svgDom.style.height = '0';
				svgDom.id = '${opt.customDomId}';
				svgDom.setAttribute('xmlns','${XMLNS}');
				svgDom.setAttribute('xmlns:link','${XMLNS_LINK}');
			  }
			  svgDom.innerHTML =${JSON.stringify(html)};
			  body.insertBefore(svgDom, body.lastChild);
			}
			if(document.readyState === 'loading') {
			  document.addEventListener('DOMContentLoaded', loadSvg);
			} else {
			  loadSvg()
			}
		 }
		 export default {}`
		return code
	}

	const compilerIcons = async () => {
		let result = ''
		const dirs = readdirSync(opt.dir)
		for (let i = 0; i < dirs.length; i++) {
			const file = dirs[i]
			if (/.svg$/.test(file)) {
				const xmlns = `xmlns="${XMLNS}"`
				const symbolId = `icon-${file.slice(0, file.indexOf('.'))}`
				if (cache[symbolId] === undefined) {
					const svgStr = readFileSync(join(opt.dir, file), 'utf-8')
					const svgWidtReslut = / width=\"(.*?)\"/.exec(svgStr)
					const svgHightReslut = / height=\"(.*?)\"/.exec(svgStr)
					const svgViewBoxReslut = / viewBox=\"(.*?)\"/.exec(svgStr)
					const viewBox =
						svgViewBoxReslut !== null
							? svgViewBoxReslut[1]
							: `0,0,${svgWidtReslut !== null ? svgWidtReslut[1] : 128},${
									svgHightReslut !== null ? svgHightReslut[1] : 128
								}`
					const svgPath = svgStr.replace(/<svg(S*?)[^>]*>/, '').replace('</svg>', '')
					cache[symbolId] = `<symbol ${xmlns} viewBox="${viewBox}" id="${symbolId}">${svgPath}</symbol>`
				}
				result += cache[symbolId]
			}
		}
		return `${result}`
	}

	return {
		name: 'vite-svg-icons',
		async load(id) {
			if (id.endsWith(TURGER_PATH)) {
				return await createModuleCode()
			}
		},
		configureServer: ({ middlewares }) => {
			middlewares.use(async (req, res, next) => {
				const path = normalizePath(req.url!)
				if (path.endsWith(TURGER_PATH)) {
					res.setHeader('Content-Type', 'application/javascript')
					res.setHeader('Cache-Control', 'no-cache')
					const code = await createModuleCode()
					res.statusCode = 200
					res.end(code)
				} else {
					next()
				}
			})
		}
	}
}

export { createSvgIconsPlugin }
