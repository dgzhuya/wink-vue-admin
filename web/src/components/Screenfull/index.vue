<script lang="ts" name="screenfull" setup>
	import screenfull from 'screenfull'

	const isFullScreen = ref(false)

	const change = () => (isFullScreen.value = screenfull.isFullscreen)

	onMounted(() => screenfull.on('change', change))
	onUnmounted(() => screenfull.off('change', change))
</script>
<template>
	<div>
		<svg-icon :icon="isFullScreen ? 'exit-fullscreen' : 'fullscreen'" @click="screenfull.toggle()"></svg-icon>
	</div>
</template>
<style lang="scss" scoped></style>
