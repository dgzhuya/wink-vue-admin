<template>
	<el-config-provider :locale="locale">
		<router-view></router-view>
	</el-config-provider>
</template>
<script lang="ts" setup>
	import zhCn from 'element-plus/lib/locale/lang/zh-cn'
	import { generateNewStyle, writeStyle } from '@web/utils/style'
	import { useTheme } from './store/module/theme'

	const locale = zhCn
	const { color } = useTheme()
	generateNewStyle(color).then(styleText => writeStyle(styleText))
</script>
