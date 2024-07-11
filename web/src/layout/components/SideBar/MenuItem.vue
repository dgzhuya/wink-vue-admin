<script lang="ts" setup>
	withDefaults(defineProps<{ icon?: string; title: string }>(), {
		icon: 'tree'
	})
</script>
<template>
	<svg-icon :icon="icon"></svg-icon>
	<span>{{ title }}</span>
</template>
<style lang="scss" scoped>
	span {
		margin-left: 5px;
	}
</style>
