<template>
	<el-config-provider :locale="zhCn">
		<router-view></router-view>
	</el-config-provider>
</template>
<script lang="ts" setup>
	import { generateNewStyle, writeStyle } from '@web/utils/style'
	// @ts-ignore
	import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
	import { useTheme } from './store/module/theme'

	const { color } = useTheme()
	generateNewStyle(color).then(styleText => writeStyle(styleText))
</script>
