<script lang="ts" setup>
	import { CreatePermissionDto, PermissionDto, PermissionModel } from '@/types/super-admin/permission'
	import { updatePermission, createPermission } from '@/api/super-admin/permission'
	import { toast } from '@/utils/toast'

	const props = defineProps<{ permission: PermissionModel | null; showForm: boolean; parentId: number }>()
	const permissionId = ref(-1)
	const permissionInfo = ref<Partial<PermissionDto>>({})
	const resetPermission = () => {
		permissionInfo.value = {}
		permissionId.value = -1
	}

	watchEffect(async () => {
		if (props.permission !== null) {
			resetPermission()
			permissionId.value = props.permission.id
			permissionInfo.value = {
				title: props.permission.title,
				description: props.permission.description,
				key: props.permission.key
			}
			permissionId.value = props.permission.id
		} else {
			resetPermission()
		}
	})

	const permissionFormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const closeHandler = () => {
		permissionFormEmit('close', false)
	}

	const updateUser = async () => {
		if (props.permission === null) {
			if (!permissionInfo.value.title) {
				toast('用户名不能为空')
				return
			}
			if (!permissionInfo.value.description) {
				toast('角色描述不能为空')
				return
			}
			const createPermissionDto: CreatePermissionDto = {
				title: permissionInfo.value.title,
				description: permissionInfo.value.description
			}

			if (permissionInfo.value.key !== '' && permissionInfo.value.key !== undefined) {
				createPermissionDto.key = permissionInfo.value.key
			}

			if (props.parentId !== -1) {
				createPermissionDto.parentId = props.parentId
			}

			await createPermission(createPermissionDto)
		}
		if (props.permission) {
			await updatePermission(permissionInfo.value, props.permission.id)
		}
		resetPermission()
		permissionFormEmit('close', true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="props.permission === null ? '添加权限' : '编辑权限'"
		width="50%"
		@close="closeHandler()"
		custom-class="permission-form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="permissionInfo" label-width="120px" class="permission-detail">
			<el-form-item label="标题">
				<el-input v-model="permissionInfo.title" />
			</el-form-item>
			<el-form-item label="关键字">
				<el-input v-model="permissionInfo.key" />
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="permissionInfo.description" maxlength="100" show-word-limit type="textarea" />
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
	.permission-form-container {
		position: relative;
	}
	.permission-detail {
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
