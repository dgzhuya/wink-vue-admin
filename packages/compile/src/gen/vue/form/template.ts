export const formSource = `<script lang="ts" setup>
	import { %upperModuleName%Dto, %upperModuleName%Model } from '@/types/super-admin/%moduleName%'
	import { update%upperModuleName%Info, create%upperModuleName%, set%upperModuleName%MajorRole } from '@/api/super-admin/%moduleName%'
	import { toast } from '@/utils/toast'

	const props = defineProps<{ %moduleName%: %upperModuleName%Model | null; showForm: boolean }>()
	const %moduleName%Info = ref<Partial<%upperModuleName%Dto>>({})
	const createPassword = ref('')
	const %moduleName%Id = ref(-1)
	const reset%upperModuleName% = () => {
		%moduleName%Id.value = -1
		%moduleName%Info.value = {}
	}

	watchEffect(async () => {
		if (props.%moduleName% !== null) {
			reset%upperModuleName%()
			%moduleName%Id.value = props.%moduleName%.id
			%moduleName%Info.value = {
				...props.%moduleName%
			}
		} else {
			reset%upperModuleName%()
		}
	})

	const %moduleName%FormEmit = defineEmits<{ (e: 'close', refresh: boolean): void }>()

	const uploadIcon = () => {
		console.log('上传头像')
	}

	const setMajorHandler = async (rid: number) => {
		if (props.%moduleName% !== null) await set%upperModuleName%MajorRole(props.%moduleName%.id, rid)
	}

	const closeHandler = () => {
		%moduleName%FormEmit('close', false)
	}

	const update%upperModuleName% = async () => {
		if (props.%moduleName% === null) {
			await create%upperModuleName%({
				...userInfo.value,
				username: userInfo.value.username,
				password: createPassword.value,
				nickname: userInfo.value.nickname
			})
		}
		if (props.user) {
			await update%upperModuleName%Info(userInfo.value, props.user.id)
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
			<el-button @click="update%upperModuleName%()" type="primary">保存</el-button>
			<el-button @click="closeHandler()" type="info">取消</el-button>
		</div>
	</template>
</el-dialog>
</template>
<style lang="scss" scoped>
.%moduleName%-form-container {
	position: relative;
}
.%moduleName%-detail {
	text-align: center;
	width: 70%;
	margin: 0 auto;

	.%moduleName%-avatar {
		cursor: pointer;
		width: 50px;
		height: 50px;
		box-sizing: border-box;
		border-radius: 10px;
		font-size: 50px;
		margin-bottom: 10px;
	}
}

.%moduleName%-form-footer {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>
`
