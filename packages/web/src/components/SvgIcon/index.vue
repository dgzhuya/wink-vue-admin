<script lang="ts" name="svg-icon" setup>
	import { isExternal as external } from '@web/utils/validate'
	interface SvgIconProp {
		icon: string | null
		className?: string
	}

	const svgIconProp = withDefaults(defineProps<SvgIconProp>(), {
		className: '',
		icon: ''
	})

	const iconUrl = computed(() =>
		!svgIconProp.icon ? 'https://i01piccdn.sogoucdn.com/11e7f7be63582586' : svgIconProp.icon
	)

	const isExternal = computed(() => external(iconUrl.value))

	const iconName = computed(() => `#icon-${iconUrl.value}`)
</script>
<template>
	<img v-if="isExternal" :src="iconUrl" class="svg-external-icon" :class="className" />
	<svg v-else class="svg-icon" :class="className" aria-hidden="true">
		<use :xlink:href="iconName" />
	</svg>
</template>
<style lang="scss">
	.svg-icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

	.svg-external-icon {
		width: 20px;
		height: 20px;
		display: inline-block;
	}
</style>
