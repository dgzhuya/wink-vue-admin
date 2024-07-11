<script lang="ts" name="login" setup>
	import { loginRules, passwordType } from './rule'
	import { useUser } from '@web/store/module/user'
	import { FormInstance } from 'element-plus'

	const user = useUser()
	const loginFormRef = ref<FormInstance>()

	const loginForm = ref({
		username: '',
		password: ''
	})
</script>
<template>
	<div class="login-container">
		<el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
			<div class="title-container">
				<h3 class="title">用户登录</h3>
			</div>
			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon="user"></svg-icon>
				</span>
				<el-input placeholder="用户名" v-model="loginForm.username" name="username"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon="password"></svg-icon>
				</span>
				<el-input
					placeholder="密码"
					v-model="loginForm.password"
					name="password"
					:type="passwordType"
				></el-input>
				<span class="show-pwd">
					<svg-icon
						:icon="passwordType === 'password' ? 'eye' : 'eye-open'"
						@click="passwordType = passwordType === 'text' ? 'password' : 'text'"
					></svg-icon>
				</span>
			</el-form-item>
			<el-button
				@click="user.login(loginFormRef, loginForm)"
				type="primary"
				style="width: 100%; margin-bottom: 30px"
				>登录</el-button
			>
		</el-form>
	</div>
</template>
<style lang="scss" scoped>
	// login
	$bg: #2d3a4b;
	$dark_gray: #889aa4;
	$light_gray: #eee;
	$cursor: #fff;

	.login-container {
		min-height: 100%;
		width: 100%;
		background-color: $bg;
		overflow: hidden;

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}

		.login-form {
			position: relative;
			width: 520px;
			margin: 0 auto;
			padding: 160px 35px 0;

			.title-container {
				position: relative;

				.title {
					font-size: 26px;
					color: $light_gray;
					margin: 0 auto 40px;
					text-align: center;
					font-weight: bold;
				}
			}

			.svg-container {
				padding: 6px 5px 6px 15px;
				color: $dark_gray;
				vertical-align: middle;
				display: inline-block;
			}

			:deep(.el-form-item) {
				border: 1px solid rgba(255, 255, 255, 0.1);
				background-color: rgba(0, 0, 0, 0.1);
				border-radius: 5px;
				color: #454545;
				display: flex;
				align-items: center;
			}

			:deep(.el-input) {
				display: inline-block;
				height: 47px;
				width: 85%;

				.el-input__wrapper {
					background-color: transparent;
					box-shadow: none;
				}

				input {
					height: 47px;
					background: transparent;
					border: none;
					border-radius: 0;
					padding: 12px 5px 12px 15px;
					color: $light-gray;
					caret-color: $cursor;
				}
			}
		}
	}
</style>
