<template>
	<div class="list-container">
		<el-card v-permission="['super-admin_role_add']" class="list-header">
			<el-button @click="showHandler()" v-permission="['super-admin_role_add']" type="primary"
				>添加角色</el-button
			>
		</el-card>
		<el-card>
			<el-table :data="tableData" border style="list-table-container">
				<el-table-column label="#" type="index" />
				<el-table-column prop="title" :width="80" label="标题"> </el-table-column>
				<el-table-column prop="description" label="描述"> </el-table-column>
				<el-table-column label="创建时间" :width="180">
					<template #default="{ row }">
						{{ dateHandler(row.createTime) }}
					</template>
				</el-table-column>
				<el-table-column label="修改时间" :width="180">
					<template #default="{ row }">
						{{ dateHandler(row.updateTime) }}
					</template>
				</el-table-column>
				<el-table-column
					v-permission="['super-admin_role_permission', 'super-admin_role_update', 'super-admin_role_delete']"
					label="操作"
					fixed="right"
					width="260"
				>
					<template #default="{ row }">
						<el-button
							type="primary"
							v-permission="['super-admin_role_update']"
							@click="showHandler(row)"
							size="small"
							>编辑</el-button
						>
						<el-button
							type="success"
							v-permission="['super-admin_role_permission']"
							@click="openPermissionHandler(row.id)"
							size="small"
							>设置权限</el-button
						>
						<el-button
							v-permission="['super-admin_role_delete']"
							type="danger"
							@click="deleteHandler(row.id)"
							size="small"
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
		<role-form :role="roleActive" :show-form="showModel" @close="closeHandler"></role-form>
		<role-premission v-model:show="showPermissions" :rid="activeRid"></role-premission>
	</div>
</template>

<script lang="ts" setup>
	import { getRoleList, deleteRole } from '@/api/super-admin/role'
	import { pageEffect } from '@/effect/page'
	import { RoleModel } from '@/types/super-admin/role'
	import { dateHandler } from '@/utils/format'
	import { showFormEffect } from '@/effect/show-form'
	import RoleForm from './role-form.vue'
	import RolePremission from './role-premission.vue'
	import { deleteEffect } from '@/effect/delete'

	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(getRoleList)
	onMounted(async () => {
		await fetchHandler()
	})

	const roleActive = ref<RoleModel | null>(null)
	const { showHandler, showModel, closeHandler } = showFormEffect(roleActive, fetchHandler)
	const { deleteHandler } = deleteEffect(deleteRole, fetchHandler, '此角色')
	const showPermissions = ref(false)
	const activeRid = ref(0)
	const openPermissionHandler = (rid: number) => {
		showPermissions.value = true
		activeRid.value = rid
	}
</script>

<style lang="scss" scoped>
	@import '@/style/table.scss';
</style>
