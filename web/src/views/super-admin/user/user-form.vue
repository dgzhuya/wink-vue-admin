<script lang="ts" setup>
	import SvgIcon from '@web/components/SvgIcon/index.vue'
	import { UserDto, UserModel } from '@web/types/super-admin/user'
	import { updateUserInfo, createUser, setUserMajorRole } from '@web/api/super-admin/user'
	import { showToast } from '@web/utils/toast'
	import { pickerKeyVal } from '@web/utils/pickerKeyVal'

	const props = defineProps<{ user: UserModel | null; showForm: boolean }>()
	const userId = ref(-1)
	const userInfo = ref<UserDto>({})
	const createPassword = ref('')

	watchEffect(async () => {
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

	const closeHandler = (refresh = false) => {
		userFormEmit('close', refresh)
		setTimeout(() => {
			userId.value = -1
			userInfo.value = {}
		}, 100)
	}

	const updateUser = async () => {
		if (props.user === null) {
			if (!userInfo.value.username) {
				showToast('用户名不能为空')
				return
			}
			if (!createPassword.value) {
				showToast('密码不能为空')
				return
			}
			if (!userInfo.value.nickname) {
				showToast('用户昵称不能为空')
				return
			}

			await createUser({
				...userInfo.value,
				password: createPassword.value
			})
		} else {
			await updateUserInfo(userInfo.value, props.user.id)
		}
		closeHandler(true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="props.user === null ? '添加用户' : '编辑用户'"
		@close="closeHandler()"
		class="form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="userInfo" label-width="120px" class="form-detail">
			<svg-icon :icon="userInfo.avatar" @click="uploadIcon()" class-name="form-avatar"></svg-icon>
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
				<el-select v-model="user.major" @change="setMajorHandler" placeholder="未知">
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
	@import '@web/style/form.scss';
</style>
