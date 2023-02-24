<script lang="ts" name="theme-select" setup>
	import SelectColor from './SelectColor/index.vue'

	const selectColorVisible = ref(false)
	const handleSetTheme = (command: string) => {
		if (command === 'color') {
			selectColorVisible.value = true
		}
	}
</script>
<template>
	<el-dropdown trigger="click" class="theme" @command="handleSetTheme">
		<div>
			<el-tooltip content="主题修改">
				<svg-icon icon="change-theme"></svg-icon>
			</el-tooltip>
			<select-color v-model="selectColorVisible"></select-color>
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item command="color">主题色更换</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>
<style lang="scss" scoped></style>
