<script lang="ts" setup>
	import { useApp } from '@/store/module/app'

	const app = useApp()
	const icon = computed(() => (app.sideBarStatus ? 'hamburger-opened' : 'hamburger-closed'))
</script>
<template>
	<div class="hamburger-container" @click="app.trigerSidebarOpened()">
		<svg-icon class="hamburger" :icon="icon"></svg-icon>
	</div>
</template>
<style lang="scss" scoped>
	.hamburger-container {
		padding: 0 16px;

		.hamburger {
			display: inline-block;
			vertical-align: middle;
			width: 20px;
			height: 20px;
		}
	}
</style>
