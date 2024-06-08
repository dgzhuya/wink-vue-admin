<template>
	<el-config-provider>
		<router-view></router-view>
	</el-config-provider>
</template>
<script lang="ts" setup>
	import { generateNewStyle, writeStyle } from '@web/utils/style'
	import { useTheme } from './store/module/theme'

	const { color } = useTheme()
	generateNewStyle(color).then(styleText => writeStyle(styleText))
</script>
