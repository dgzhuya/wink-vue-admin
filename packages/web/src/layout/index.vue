<script lang="ts" name="layout" setup>
	import { useApp } from '@/store/module/app'
	import TagView from '@/components/TagView/index.vue'

	const app = useApp()
</script>
<template>
	<side-bar></side-bar>
	<div class="main-container" :class="[app.sideBarStatus ? 'open-sidebar' : 'hidden-sidebar']">
		<div class="fixed-header">
			<nav-bar></nav-bar>
			<tag-view></tag-view>
		</div>
		<app-main></app-main>
	</div>
</template>
<style lang="scss" scoped>
	.main-container {
		transition: margin-left #{$sideBarDuration};
		height: 100vh;
		position: relative;
		box-sizing: border-box;

		.fixed-header {
			position: fixed;
			top: 0;
			right: 0;
			z-index: 9;
			transition: width #{$sideBarDuration};
		}
	}

	.open-sidebar {
		margin-left: $sideBarWidth;

		.fixed-header {
			width: calc(100% - #{$sideBarWidth});
		}
	}

	.hidden-sidebar {
		margin-left: $hideSideBarWidth;

		.fixed-header {
			width: calc(100% - #{$hideSideBarWidth});
		}
	}
</style>
