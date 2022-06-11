<script lang="ts" setup>
	import { useUser } from '@/store/module/user'
	import { ResetParams } from '@/types/super-admin'
	import { storeToRefs } from 'pinia'
	import { dateHandler } from '@/utils/format'
	import { toast } from '@/utils/toast'
	import { resetPassword } from '@/api'

	const user = useUser()
	const { info } = storeToRefs(user)
	const resetParams = ref<ResetParams>({
		currentPassword: '',
		newPassword: ''
	})

	const showDialog = ref<boolean>(false)

	const handleClose = () => {
		showDialog.value = false
	}

	const resetHandler = async () => {
		if (
			!resetParams.value.currentPassword ||
			resetParams.value.currentPassword.length === 0 ||
			resetParams.value.currentPassword.length > 20
		) {
			toast('密码长度在6-20位之间')
			return
		}
		if (
			!resetParams.value.newPassword ||
			resetParams.value.newPassword.length === 0 ||
			resetParams.value.newPassword.length > 20
		) {
			toast('新密码长度在6-20位之间')
			return
		}
		if (resetParams.value.currentPassword === resetParams.value.newPassword) {
			toast('密码不能重复')
			return
		}
		try {
			await resetPassword(resetParams.value)
			setTimeout(() => {
				user.loginout()
			}, 800)
			toast('修改成功,即将退出登录', 'success')
		} catch (error) {
			console.log('error:', error)
		}
		handleClose()
	}
</script>
<template>
	<div class="info-field-container">
		<div>用户名:</div>
		{{ info.username }}
	</div>
	<div class="info-field-container">
		<div>昵称:</div>
		{{ info.nickname }}
	</div>
	<div class="info-field-container">
		<div>创建时间:</div>
		{{ dateHandler(info.createTime) }}
	</div>
	<div class="info-field-container">
		<div>性别:</div>
		{{ info.gender === 0 ? '女' : info.gender === 1 ? '男' : '未知' }}
	</div>
	<div class="info-field-container">
		<div>角色信息:</div>
		<div v-for="role in info.roles" :key="role.id">{{ role.title }}</div>
	</div>

	<div v-if="info.mobile" class="info-field-container">
		<div>手机号:</div>
		{{ info.mobile }}
	</div>
	<div v-if="info.address" class="info-field-container">
		<div>用户地址:</div>
		{{ info.address }}
	</div>
	<el-button class="edit-password" @click="showDialog = true" type="primary">修改密码</el-button>
	<el-dialog v-model="showDialog" custom-class="profile-form-container" title="修改密码" :before-close="handleClose">
		<el-form ref="formRef" :model="resetParams" label-width="120px" class="form-detail">
			<el-form-item label="当前密码">
				<el-input v-model="resetParams.currentPassword" />
			</el-form-item>
			<el-form-item label="新密码">
				<el-input v-model="resetParams.newPassword" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="resetHandler">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
	@import '@/style/form.scss';

	.info-field-container {
		display: flex;
		box-sizing: border-box;
		line-height: 30px;

		div {
			&:nth-child(1) {
				color: #666;
				margin-right: 10px;
			}
		}
	}

	.edit-password {
		margin-top: 10px;
	}
</style>
