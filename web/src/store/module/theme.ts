import { defineStore } from 'pinia'
import variablesModule from '@web/style/variables.module.scss'
import { DEFAULT_COLOR, MAIN_COLOR } from '@web/constants'
import { generateColors } from '@web/utils/style'
import { getItem, setItem } from '@web/utils/store'

export const useTheme = defineStore('theme', {
	state: () => {
		const mainColor: string = getItem(MAIN_COLOR) || DEFAULT_COLOR
		return {
			variables:
				mainColor === DEFAULT_COLOR ? variablesModule : { ...variablesModule, ...generateColors(mainColor) },
			mainColor
		}
	},
	getters: {
		cssVar: state => state.variables,
		color: state => state.mainColor
	},
	actions: {
		setMainColor(newColor: string) {
			this.$state.mainColor = newColor
			this.$state.variables =
				newColor === DEFAULT_COLOR ? variablesModule : { ...variablesModule, ...generateColors(newColor) }
			setItem(MAIN_COLOR, newColor)
		}
	}
})
