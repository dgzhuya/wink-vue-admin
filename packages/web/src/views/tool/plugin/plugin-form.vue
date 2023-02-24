<script lang="ts" setup>
	import { PluginDto, PluginModel } from '@/types/tool/plugin'
	import { updatePlugin, createPlugin } from '@/api/tool/plugin'
	import { toast } from '@/utils/toast'
	import { pickerKeyVal } from '@/utils/pickerKeyVal'

	const props = defineProps<{ plugin: PluginModel | null; showForm: boolean }>()
	const pluginId = ref(-1)
	const pluginInfo = ref<PluginDto>({})

	watchEffect(async () => {
		if (props.plugin !== null) {
			pluginInfo.value = pickerKeyVal(props.plugin, 'name', 'description', 'url')
			pluginId.value = props.plugin.id
		}
	})

	const pluginFormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const closeHandler = (refresh = false) => {
		pluginFormEmit('close', refresh)
		setTimeout(() => {
			pluginInfo.value = {}
			pluginId.value = -1
		}, 100)
	}

	const updateUser = async () => {
		if (props.plugin === null) {
			if (!pluginInfo.value.name) {
				toast('插件名称不能为空')
				return
			}
			if (!pluginInfo.value.description) {
				toast('插件描述不能为空')
				return
			}
			if (!pluginInfo.value.url) {
				toast('插件URL不能为空')
				return
			}
			await createPlugin(pluginInfo.value)
		} else {
			await updatePlugin(pluginInfo.value, props.plugin.id)
		}
		closeHandler(true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="props.plugin ? '添加插件' : '编辑插件'"
		@close="closeHandler()"
		class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="pluginInfo" label-width="120px" class="form-detail">
			<el-form-item label="插件名称">
				<el-input v-model="pluginInfo.name" />
			</el-form-item>
			<el-form-item label="插件描述">
				<el-input v-model="pluginInfo.description" maxlength="100" show-word-limit type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="form-footer">
				<el-button @click="updateUser()" type="primary">保存</el-button>
				<el-button @click="closeHandler()" type="info">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
	@import '@/style/form.scss';
</style>
