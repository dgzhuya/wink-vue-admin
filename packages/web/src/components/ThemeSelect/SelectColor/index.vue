<script lang="ts" setup>
	import { predefineColors } from './colors'
	import { useTheme } from '@web/store/module/theme'
	import { generateNewStyle, writeStyle } from '@web/utils/style'
	import { DEFAULT_COLOR } from '@web/constants'

	defineProps<{ modelValue: boolean }>()
	const theme = useTheme()
	const mColor = ref(theme.color)
	const emits = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

	const close = () => {
		emits('update:modelValue', false)
	}

	const confirm = async () => {
		writeStyle(await generateNewStyle(mColor.value === null ? DEFAULT_COLOR : mColor.value))
		theme.setMainColor(mColor.value === null ? DEFAULT_COLOR : mColor.value)
		close()
	}
</script>
<template>
	<el-dialog title="提示" :model-value="modelValue" @closed="close()" width="22%">
		<div class="center">
			<p class="title">主题色更换</p>
			<el-color-picker v-model="mColor" :predefine="predefineColors"></el-color-picker>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close()">取消</el-button>
				<el-button type="primary" @click="confirm()">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
	.center {
		text-align: center;

		.title {
			margin-bottom: 12px;
		}
	}
</style>
