<script lang="ts" setup>
	import { useApp } from '@/store/module/app'

	const app = useApp()
</script>
<template>
	<div class="app-main" :class="app.showTags ? 'show-tags' : 'hidden-tags'">
		<router-view v-slot="{ Component, route }">
			<transition name="fade-tranform" mode="out-in">
				<keep-alive>
					<component :is="Component" :key="route.path"></component>
				</keep-alive>
			</transition>
		</router-view>
	</div>
</template>
<style lang="scss" scoped>
	.app-main {
		min-height: 100vh;
		width: 100%;
		position: relative;
		transition: padding-top $tagsViewDuration;
		overflow-y: hidden;
		box-sizing: border-box;
	}

	.show-tags {
		padding: calc(#{$navbarHeight} + #{$tagViewHeight} + 10px) 20px 20px;
	}

	.hidden-tags {
		padding: calc(#{$navbarHeight} + 10px) 20px 20px;
	}

	.fade-transform-leave-active,
	.fade-transform-enter-active {
		transition: all 0.5s;
	}

	.fade-transform-enter-from {
		opacity: 0;
		transform: translateX(-30px);
	}

	.fade-transform-leave-to {
		opacity: 0;
		transform: translateX(30px);
	}
</style>
