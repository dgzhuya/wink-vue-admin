<script lang="ts" setup>
	import { CreatePermissionDto, PermissionDto, PermissionModel } from '@/types/super-admin/permission'
	import { updatePermission, createPermission } from '@/api/super-admin/permission'
	import { toast } from '@/utils/toast'
	import { pickerKeyVal } from '@/utils/pickerKeyVal'

	const props = defineProps<{ permission: PermissionModel | null; showForm: boolean; parentId: number }>()
	const permissionId = ref(-1)
	const permissionInfo = ref<PermissionDto>({})

	watchEffect(async () => {
		if (props.permission !== null) {
			permissionId.value = props.permission.id
			permissionInfo.value = pickerKeyVal(props.permission, 'title', 'description', 'key')
		}
	})

	const permissionFormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const closeHandler = (refresh = false) => {
		permissionFormEmit('close', refresh)
		setTimeout(() => {
			permissionInfo.value = {}
			permissionId.value = -1
		}, 100)
	}

	const updateUser = async () => {
		if (props.permission === null) {
			if (!permissionInfo.value.title) {
				toast('权限名不能为空')
				return
			}
			if (!permissionInfo.value.description) {
				toast('权限描述不能为空')
				return
			}
			if (!permissionInfo.value.key) {
				toast('权限关键字不能为空')
				return
			}

			const createPermissionDto: CreatePermissionDto = permissionInfo.value

			if (props.parentId !== -1) {
				createPermissionDto.parentId = props.parentId
			}
			await createPermission(createPermissionDto)
		} else {
			await updatePermission(permissionInfo.value, props.permission.id)
		}
		closeHandler(true)
	}
</script>

<template>
	<el-dialog
		:model-value="showForm"
		:title="props.permission === null ? '添加权限' : '编辑权限'"
		@close="closeHandler()"
		custom-class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="permissionInfo" label-width="120px" class="form-detail">
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
