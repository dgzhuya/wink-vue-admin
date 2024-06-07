<script lang="ts" name="side-bar" setup>
	import { useApp } from '@web/store/module/app'
	import { useTheme } from '@web/store/module/theme'
	import { storeToRefs } from 'pinia'

	const { cssVar } = storeToRefs(useTheme())
	const logoSize = parseInt(cssVar.value.sideBarLogoSize)
	const app = useApp()
</script>
<template>
	<div
		class="sidebar-container"
		:style="{
			backgroundColor: cssVar.menuBg,
			width: app.sideBarStatus ? cssVar.sideBarWidth : cssVar.hideSideBarWidth
		}"
	>
		<div class="logo-container">
			<el-avatar
				:size="logoSize"
				shape="square"
				src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
			></el-avatar>
			<h1 class="logo-title" v-if="app.sideBarStatus">wink-admin</h1>
		</div>
		<el-scrollbar>
			<sidebar-menu></sidebar-menu>
		</el-scrollbar>
	</div>
</template>
<style lang="scss" scoped>
	.sidebar-container {
		transition: width #{$sideBarDuration};
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		overflow: hidden;

		.logo-container {
			height: #{$sideBarLogoSize}px;
			padding: 10px 0 22px;
			display: flex;
			align-items: center;
			justify-content: center;

			.logo-title {
				margin-left: 10px;
				color: #fff;
				font-weight: 60px;
				line-height: 50px;
				font-size: 16px;
			}
		}
	}
</style>
