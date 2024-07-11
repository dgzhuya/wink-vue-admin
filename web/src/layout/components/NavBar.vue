<script lang="ts" setup>
	import { useUser } from '@web/store/module/user'
	import ThemeSelect from '@web/components/ThemeSelect/index.vue'
	import Hamburger from '@web/components/Hamburger/index.vue'
	import Breadcrumb from '@web/components/Breadcrumb/index.vue'
	import Screenfull from '@web/components/Screenfull/index.vue'
	import HeaderSearch from '@web/components/HeaderSearch/index.vue'
	import SvgIcon from '@web/components/SvgIcon/index.vue'

	const user = useUser()
</script>
<template>
	<div class="navbar">
		<div class="left-menu">
			<hamburger class="hanburger-container"></hamburger>
			<breadcrumb></breadcrumb>
		</div>
		<div class="right-menu">
			<header-search class="right-menu-item hover-effect"></header-search>
			<screenfull class="right-menu-item hover-effect"></screenfull>
			<theme-select class="right-menu-item hover-effect"></theme-select>
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wapper">
					<svg-icon :icon="user.info.avatar" class-name="avatar-img"></svg-icon>
					<svg-icon icon="setting" style="font-size: 20px"></svg-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<router-link to="/">
							<el-dropdown-item>首页</el-dropdown-item>
						</router-link>
						<!-- <a target="_blank" href="">
							<el-dropdown-item>课程主页</el-dropdown-item>
						</a> -->
						<el-dropdown-item @click="user.loginout()" divided>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.navbar {
		height: $navbarHeight;
		overflow: hidden;
		position: relative;
		background-color: #fff;
		box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;

		.left-menu {
			display: flex;
			align-items: center;

			.hanburger-container {
				position: relative;
				cursor: pointer;
				line-height: calc($navbarHeight - 6px);
				transition: background 0.5s;
				height: 100%;

				&:hover {
					background-color: rgba(0, 0, 0, 0.1);
				}
			}
		}

		.right-menu {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 16px;

			:deep(.right-menu-item) {
				display: inline-block;
				padding: 0 18px 0 0;
				font-size: 24px;
				color: #5a5e66;
				vertical-align: text-bottom;

				&.hover-effect {
					cursor: pointer;
					transition: background 0.3s;

					&:hover {
						background: rgba(0, 0, 0, 0.025);
					}
				}
			}

			:deep(.avatar-container) {
				cursor: pointer;
				margin-right: 10px;

				.avatar-wapper {
					margin-top: 5px;
					position: relative;
					display: flex;
					align-items: center;

					.avatar-img {
						width: 40px;
						height: 40px;
						margin-right: 10px;
						border-radius: 5px;
						font-size: 40px;
					}
				}
			}
		}
	}
</style>
