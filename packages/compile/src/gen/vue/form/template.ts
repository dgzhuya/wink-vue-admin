export const formSource = `<script lang="ts" setup>
	import { %upperModuleName%Dto, %upperModuleName%Model } from '@/types/super-admin/%upperModuleName%'
	import { update%upperModuleName%, create%upperModuleName% } from '@/api/super-admin/%upperModuleName%'
	import { toast } from '@/utils/toast'
	import { pickerKeyVal } from '@/utils/pickerKeyVal'

	const props = defineProps<{ %upperModuleName%: %upperModuleName%Model | null; showForm: boolean }>()
	const %upperModuleName%Id = ref(-1)
	const %upperModuleName%Info = ref<%upperModuleName%Dto>({})

	watchEffect(async () => {
		%upperModuleName%Info.value = {}
		%upperModuleName%Id.value = -1
		if (props.%upperModuleName% !== null) {
			%upperModuleName%Info.value = pickerKeyVal(props.%upperModuleName%, %moduleFormKeys%)
			%upperModuleName%Id.value = props.%upperModuleName%.id
		}
	})

	const formEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()
	const closeHandler = () => {
		formEmit('close', false)
	}

	const updateUser = async () => {
		if (props.%upperModuleName% === null) {
			%createCondition%			await create%upperModuleName%(%upperModuleName%Info.value)
		} else {
			await update%upperModuleName%(%upperModuleName%Info.value, props.%upperModuleName%.id)
		}
		formEmit('close', true)
	}
</script>

<template>
	<el-dialog
		:model-value="showForm"
		:title="props.%upperModuleName% ? '添加角色' : '编辑角色'"
		@close="closeHandler()"
		custom-class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="%upperModuleName%Info" label-width="120px" class="form-detail">
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
