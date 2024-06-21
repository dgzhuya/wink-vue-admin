<script lang="ts" setup>
	import { getUserList, setUserRoles, deleteUser } from '@web/api/super-admin/user'
	import UserForm from './user-form.vue'
	import SvgIcon from '@web/components/SvgIcon/index.vue'
	import { pageEffect } from '@web/effect/page'
	import { dateHandler } from '@web/utils/format'
	import { UserModel } from '@web/types/super-admin/user'
	import { showFormEffect } from '@web/effect/show-form'
	import { RoleSimple } from '@web/types/super-admin/role'
	import { getAllRoles } from '@web/api/super-admin/role'
	import { deleteEffect } from '@web/effect/delete'

	const userActive = ref<UserModel | null>(null)
	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(getUserList)

	const { showHandler, showModel, closeHandler } = showFormEffect(userActive, fetchHandler)
	const allRoles = ref<RoleSimple[]>([])

	const { deleteHandler } = deleteEffect(deleteUser, fetchHandler, '此用户')
	onMounted(async () => {
		await fetchHandler()
		allRoles.value = await getAllRoles()
	})

	const changeUserRole = async (user: UserModel) => {
		try {
			await setUserRoles(user.id, user.roleIds)
			await fetchHandler()
		} catch (error) {
			setTimeout(() => {
				user.roleIds = user.roles.map(role => role.id)
			}, 1100)
		}
	}
</script>

<template>
	<div class="list-container">
		<el-card v-permission="['add']" class="list-header">
			<el-button v-permission="['add']" @click="showHandler()" type="primary">添加用户</el-button>
		</el-card>
		<el-card>
			<el-table :data="tableData" border class="list-table-container">
				<el-table-column label="#" type="index" />
				<el-table-column prop="username" label="用户名"> </el-table-column>
				<el-table-column label="性别" :width="80" align="center">
					<template #default="{ row }">
						{{ row.gender === 0 ? '女' : row.gender === 1 ? '男' : '未知' }}
					</template>
				</el-table-column>
				<el-table-column prop="nickname" label="昵称"> </el-table-column>
				<el-table-column label="角色" :min-width="140">
					<template #default="{ row }">
						<el-select
							v-model="row.roleIds"
							@change="changeUserRole(row)"
							multiple
							placeholder="选择角色"
							style="width: 240px"
						>
							<el-option v-for="item in allRoles" :key="item.id" :label="item.title" :value="item.id" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="头像" align="center">
					<template #default="{ row }">
						<svg-icon class-name="avatar-icon" :icon="row.avatar"></svg-icon>
					</template>
				</el-table-column>
				<el-table-column label="创建时间">
					<template #default="{ row }">
						{{ dateHandler(row.createTime) }}
					</template>
				</el-table-column>
				<el-table-column v-permission="['update', 'delete']" label="操作" fixed="right" width="260">
					<template #default="{ row }">
						<el-button v-permission="['update']" type="primary" @click="showHandler(row)" size="small"
							>编辑</el-button
						>
						<el-button v-permission="['delete']" @click="deleteHandler(row.id)" type="danger" size="small"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				class="pagination"
				@size-change="sizeHandler"
				@current-change="pageHandler"
				:current-page="page"
				:page-sizes="[2, 5, 10, 20]"
				:page-size="size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>
		<user-form @close="closeHandler" :user="userActive" :show-form="showModel"></user-form>
	</div>
</template>

<style lang="scss" scoped>
	@import '@web/style/table.scss';
</style>
