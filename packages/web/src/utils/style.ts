import { colorMap } from '@/constants/color-map'
import formula from '@/constants/formula.json'
import { dependencies } from '../../package.json'
import axios from 'axios'
import rgbHex from 'rgb-hex'

export const generateColors = (primary: string) => {
	const colors: Record<string, string> = {
		primary
	}
	Object.keys(formula).forEach(key => {
		const value = formula[key as keyof typeof formula].replace(/primary/g, primary)
		colors[key] = `#${rgbHex(hexToRgb(value))}`
	})
	return colors
}

export const generateNewStyle = async (primaryColor: string) => {
	const colors = generateColors(primaryColor)
	let cssText = await getOriginalStyle()
	Object.keys(colors).forEach(key => {
		cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + colors[key as keyof typeof colors])
	})
	return cssText
}

const getOriginalStyle = async () => {
	const version = dependencies['element-plus'].replace('^', '')
	const url = `https://unpkg.com/element-plus@${version}/dist/index.css`
	const { data } = await axios(url)
	return getStyleTemplate(data)
}

const getStyleTemplate = (data: string) => {
	Object.keys(colorMap).forEach(key => {
		const value = colorMap[key as keyof typeof colorMap]
		data = data.replace(new RegExp(key, 'ig'), value)
	})
	return data
}

export const writeStyle = (elNewStyle: string) => {
	const style = document.createElement('style')
	style.innerText = elNewStyle
	document.head.appendChild(style)
}

const hexToRgb = (hexStr: string) => {
	const regHexColor = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/
	const regHexAplha = /tint\(([0-9]{2}\%)\)/
	if (regHexColor.test(hexStr)) {
		const color = []
		const hexRegRes = regHexColor.exec(hexStr)
		if (hexRegRes === null) {
			return ''
		}
		const hex = hexRegRes[1]

		const alphaRegRes = regHexAplha.exec(hexStr)
		if (hex.length === 3) {
			for (let i = 0; i < 3; i++) {
				color[i] = parseInt(hex[i] + hex[i], 16)
			}
		} else if (hex.length === 6) {
			for (let i = 0; i < 3; i++) {
				color[i] = parseInt('0x' + hex.slice(2 * i, 2 * i + 2))
			}
		}
		return `rgba(${color.join(',')}${alphaRegRes !== null ? ',' + (100 - parseInt(alphaRegRes[1])) / 100 : ''})`
	}
	return ''
}
