export const formSource = `<script lang="ts" setup>
	import { %upperModuleName%Dto, %upperModuleName%Model } from '@/types/%parentPath%/%moduleName%'
	import { update%upperModuleName%, create%upperModuleName% } from '@/api/%parentPath%/%moduleName%'
	import { toast } from '@/utils/toast'
	import { pickerKeyVal } from '@/utils/pickerKeyVal'

	const props = defineProps<{ %moduleName%: %upperModuleName%Model | null; showForm: boolean }>()
	const %moduleName%Id = ref(-1)
	const %moduleName%Info = ref<%upperModuleName%Dto>({})

	watchEffect(async () => {
		if (props.%moduleName% !== null) {
			%moduleName%Info.value = pickerKeyVal(props.%moduleName%, %moduleFormKeys%)
			%moduleName%Id.value = props.%moduleName%.id
		}
	})

	const %moduleName%FormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const closeHandler = (refresh = false) => {
		%moduleName%FormEmit('close', refresh)
		setTimeout(() => {
			%moduleName%Info.value = {}
			%moduleName%Id.value = -1
		}, 100)
	}

	const updateUser = async () => {
		if (props.%moduleName% === null) {
%createCondition%			await create%upperModuleName%(%moduleName%Info.value)
		} else {
			await update%upperModuleName%(%moduleName%Info.value, props.%moduleName%.id)
		}
		closeHandler(true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="props.%moduleName% ? '添加%moduleComment%' : '编辑%moduleComment%'"
		@close="closeHandler()"
		custom-class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="%moduleName%Info" label-width="120px" class="form-detail">
%moduleForm%		</el-form>
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
`

export const genIfCondition = (moduleName: string, key: string, comment: string) =>
	'\t'.repeat(3) +
	`if (!${moduleName}Info.value.${key}) {
				toast('${comment}不能为空')
				return
			}\n`

export const genFormTextArea = (moduleName: string, key: string, comment: string) =>
	'\t'.repeat(3) +
	`<el-form-item label="${comment}">
				<el-input v-model="${moduleName}Info.${key}" maxlength="100" show-word-limit type="textarea" />
			</el-form-item>\n`

export const genFormInput = (moduleName: string, key: string, comment: string) =>
	'\t'.repeat(3) +
	`<el-form-item label="${comment}">
				<el-input v-model="${moduleName}Info.${key}" />
			</el-form-item>\n`
