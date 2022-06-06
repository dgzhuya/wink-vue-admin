<script lang="ts" setup>
	import SvgIcon from '@/components/SvgIcon/index.vue'
	import { UserDto, UserModel } from '@/types/super-admin/user'
	import { updateUserInfo, createUser, setUserMajorRole } from '@/api/super-admin/user'
	import { toast } from '@/utils/toast'
	import { pickerKeyVal } from '@/utils/pickerKeyVal'

	const props = defineProps<{ user: UserModel | null; showForm: boolean }>()
	const userId = ref(-1)
	const userInfo = ref<UserDto>({})
	const createPassword = ref('')

	watchEffect(async () => {
		userId.value = -1
		userInfo.value = {}
		if (props.user !== null) {
			userId.value = props.user.id
			userInfo.value = pickerKeyVal(props.user, 'nickname', 'username', 'avatar', 'address', 'gender', 'mobile')
		}
	})

	const userFormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const uploadIcon = () => {
		console.log('上传头像')
	}

	const setMajorHandler = async (rid: number) => {
		if (props.user !== null) await setUserMajorRole(props.user.id, rid)
	}

	const closeHandler = () => {
		userFormEmit('close', false)
	}

	const updateUser = async () => {
		if (props.user === null) {
			if (!userInfo.value.username) {
				toast('用户名不能为空')
				return
			}
			if (!createPassword.value) {
				toast('密码不能为空')
				return
			}
			if (!userInfo.value.nickname) {
				toast('用户昵称不能为空')
				return
			}

			await createUser({
				...userInfo.value,
				password: createPassword.value
			})
		} else {
			await updateUserInfo(userInfo.value, props.user.id)
		}
		userFormEmit('close', true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="props.user === null ? '添加用户' : '编辑用户'"
		@close="closeHandler()"
		custom-class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="userInfo" label-width="120px" class="form-detail">
			<el-tooltip content="点击上传用户头像" effect="light" placement="top">
				<svg-icon :icon="userInfo.avatar" @click="uploadIcon()" class-name="form-avatar"></svg-icon>
			</el-tooltip>
			<el-form-item label="用户名">
				<el-input v-model="userInfo.username" />
			</el-form-item>
			<el-form-item v-if="user === null" label="密码">
				<el-input v-model="createPassword" />
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-model="userInfo.nickname" />
			</el-form-item>
			<el-form-item v-if="user !== null && user.roles && user.roles.length > 0" label="主要角色">
				<el-select v-model="user.majorId" @change="setMajorHandler" placeholder="未知">
					<el-option v-for="role in user.roles" :value="role.id" :label="role.title" :key="role.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="性别">
				<el-select v-model="userInfo.gender" placeholder="未知">
					<el-option label="女" :value="0" />
					<el-option label="男" :value="1" />
				</el-select>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="userInfo.mobile" />
			</el-form-item>
			<el-form-item label="地址">
				<el-input v-model="userInfo.address" maxlength="100" show-word-limit type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="form-form-footer">
				<el-button @click="updateUser()" type="primary">保存</el-button>
				<el-button @click="closeHandler()" type="info">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
	@import '@/style/form.scss';
</style>
