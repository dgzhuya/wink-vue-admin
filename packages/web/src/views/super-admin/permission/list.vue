<script lang="ts" setup>
	import { getPermissionList, getPermissionsByParent, deletePermission } from '@/api/super-admin/permission'
	import { deleteEffect } from '@/effect/delete'
	import { pageEffect } from '@/effect/page'
	import { showFormEffect } from '@/effect/show-form'
	import { PermissionModel } from '@/types/super-admin/permission'
	import { dateHandler } from '@/utils/format'
	import PermissionForm from './permission-form.vue'

	const loadChildren = async (
		row: PermissionModel,
		treeNode: unknown,
		resolve: (date: PermissionModel[]) => void
	) => {
		resolve(await getPermissionsByParent(row.id))
	}

	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(getPermissionList)
	const { deleteHandler } = deleteEffect(deletePermission, fetchHandler, '此权限')
	onMounted(async () => {
		await fetchHandler()
	})

	const parentId = ref(-1)
	const permissionActive = ref<PermissionModel | null>(null)
	const { showExtraHandler, closeHandler, showModel } = showFormEffect(permissionActive, fetchHandler, parentId)
	const tableDOM = ref()
	const tableCloseHandler = (refresh: boolean) => {
		if (refresh && tableDOM.value) {
			if ((permissionActive.value !== null && permissionActive.value.parentId) || parentId.value !== -1) {
				const { store } = tableDOM.value
				console.log('store:', store.states)
				if (parentId.value !== -1) {
					tableDOM.value.toggleRowExpansion({ id: parentId.value }, false)
					store.states.treeData.value[parentId.value].loaded = false
				} else if (permissionActive.value !== null && permissionActive.value.parentId) {
					tableDOM.value.toggleRowExpansion({ id: permissionActive.value.parentId }, false)
					store.states.treeData.value[permissionActive.value.parentId].loaded = false
				}
				closeHandler(false)
			} else {
				closeHandler(refresh)
			}
		} else {
			closeHandler(refresh)
		}
	}
</script>

<template>
	<div class="list-container">
		<el-card v-permission="['super-admin_permission_add']" class="list-header">
			<el-button v-permission="['super-admin_permission_add']" type="primary" @click="showExtraHandler(-1)"
				>添加权限</el-button
			>
		</el-card>
		<el-card>
			<el-table
				row-key="id"
				ref="tableDOM"
				lazy
				:load="loadChildren"
				:data="tableData"
				border
				style="width: 100%; margin-bottom: 10px"
			>
				<el-table-column prop="id" label="ID" :min-width="80" />
				<el-table-column prop="title" :width="180" label="标题"> </el-table-column>
				<el-table-column prop="key" label="关键字"> </el-table-column>
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
					v-permission="[
						'super-admin_permission_update',
						'super-admin_permission_add',
						'super-admin_permission_delete'
					]"
					label="操作"
					fixed="right"
					width="260"
				>
					<template #default="{ row }">
						<el-button
							type="primary"
							v-permission="['super-admin_permission_update']"
							@click="showExtraHandler(-1, row)"
							size="small"
							>编辑</el-button
						>
						<el-button
							type="success"
							v-permission="['super-admin_permission_add']"
							@click="showExtraHandler(row.id)"
							size="small"
							>添加</el-button
						>
						<el-button
							type="danger"
							v-permission="['super-admin_permission_delete']"
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
		<permission-form
			:parent-id="parentId"
			:permission="permissionActive"
			:show-form="showModel"
			@close="tableCloseHandler"
		></permission-form>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/style/table.scss';
</style>
