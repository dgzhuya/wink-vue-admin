<script lang="ts" setup>
	import SvgIcon from '@/components/SvgIcon/index.vue'
	import { UserDto, UserModel } from '@/types/super-admin/user'
	import { updateUserInfo, createUser, setUserMajorRole } from '@/api/super-admin/user'
	import { toast } from '@/utils/toast'

	const props = defineProps<{ user: UserModel | null; showForm: boolean }>()
	const userInfo = ref<Partial<UserDto>>({})
	const createPassword = ref('')
	const userId = ref(-1)
	const resetUser = () => {
		userId.value = -1
		userInfo.value = {}
	}

	watchEffect(async () => {
		if (props.user !== null) {
			resetUser()
			userId.value = props.user.id
			userInfo.value = {
				nickname: props.user.nickname,
				username: props.user.username,
				avatar: props.user.avatar,
				address: props.user.address,
				gender: props.user.gender,
				mobile: props.user.mobile
			}
		} else {
			resetUser()
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
				toast('别名不能为空')
				return
			}
			await createUser({
				...userInfo.value,
				username: userInfo.value.username,
				password: createPassword.value,
				nickname: userInfo.value.nickname
			})
		}
		if (props.user) {
			await updateUserInfo(userInfo.value, props.user.id)
		}
		userFormEmit('close', true)
	}
</script>
<template>
	<el-dialog
		:model-value="showForm"
		:title="userId === -1 ? '添加用户' : '编辑用户'"
		width="50%"
		@close="closeHandler()"
		custom-class="user-form-container"
		lock-scroll
	>
		<el-form ref="formRef" :model="userInfo" label-width="120px" class="user-detail">
			<el-tooltip content="点击上传用户头像" effect="light" placement="top">
				<svg-icon :icon="userInfo.avatar" @click="uploadIcon()" class-name="user-avatar"></svg-icon>
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
			<div class="user-form-footer">
				<el-button @click="updateUser()" type="primary">保存</el-button>
				<el-button @click="closeHandler()" type="info">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
	.user-form-container {
		position: relative;
	}
	.user-detail {
		text-align: center;
		width: 70%;
		margin: 0 auto;

		.user-avatar {
			cursor: pointer;
			width: 50px;
			height: 50px;
			box-sizing: border-box;
			border-radius: 10px;
			font-size: 50px;
			margin-bottom: 10px;
		}
	}

	.user-form-footer {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
