<script lang="ts" setup>
	import { RoleDto, RoleModel } from '@/types/super-admin/role'
	import { updateRole, createRole } from '@/api/super-admin/role'
	import { toast } from '@/utils/toast'

	const props = defineProps<{ role: RoleModel | null; showForm: boolean }>()
	const roleId = ref(-1)
	const roleInfo = ref<Partial<RoleDto>>({})
	const resetRole = () => {
		roleInfo.value = {}
		roleId.value = -1
	}

	const isAdd = computed(() => props.role === null)

	watchEffect(async () => {
		if (props.role !== null) {
			resetRole()
			roleInfo.value = { title: props.role.title, description: props.role.description }
			roleId.value = props.role.id
		} else {
			resetRole()
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
			await createRole({ title: roleInfo.value.title, description: roleInfo.value.description })
		}
		if (props.role) {
			await updateRole(roleInfo.value, props.role.id)
		}
		resetRole()
		roleFormEmit('close', true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="isAdd ? '添加角色' : '编辑角色'"
		width="50%"
		@close="closeHandler()"
		custom-class="role-form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="roleInfo" label-width="120px" class="role-detail">
			<el-form-item label="标题">
				<el-input v-model="roleInfo.title" />
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="roleInfo.description" maxlength="100" show-word-limit type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="user-form-footer">
				<el-button @click="updateUser()" type="primary">保存</el-button>
				<el-button @click="closeHandler()" type="info">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
	.role-form-container {
		position: relative;
	}
	.role-detail {
		text-align: center;
		width: 70%;
		margin: 0 auto;
	}

	.user-form-footer {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
