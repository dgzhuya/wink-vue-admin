<script lang="ts" setup>
	import { RoleDto, RoleModel } from '@/types/super-admin/role'
	import { updateRole, createRole } from '@/api/super-admin/role'
	import { toast } from '@/utils/toast'
	import { pickerKeyVal } from '@/utils/pickerKeyVal'

	const props = defineProps<{ role: RoleModel | null; showForm: boolean }>()
	const roleId = ref(-1)
	const roleInfo = ref<RoleDto>({})

	watchEffect(async () => {
		roleInfo.value = {}
		roleId.value = -1
		if (props.role !== null) {
			roleInfo.value = pickerKeyVal(props.role, 'title', 'description')
			roleId.value = props.role.id
		}
	})

	const roleFormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const closeHandler = () => {
		roleFormEmit('close', false)
	}

	const updateUser = async () => {
		if (props.role === null) {
			if (!roleInfo.value.title) {
				toast('用户名不能为空')
				return
			}
			if (!roleInfo.value.description) {
				toast('角色描述不能为空')
				return
			}
			await createRole(roleInfo.value)
		} else {
			await updateRole(roleInfo.value, props.role.id)
		}
		roleFormEmit('close', true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="props.role ? '添加角色' : '编辑角色'"
		@close="closeHandler()"
		custom-class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="roleInfo" label-width="120px" class="form-detail">
			<el-form-item label="标题">
				<el-input v-model="roleInfo.title" />
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="roleInfo.description" maxlength="100" show-word-limit type="textarea" />
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
