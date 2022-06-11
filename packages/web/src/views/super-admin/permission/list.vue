<script lang="ts" setup>
	import { getPermissionList, getPermissionsByParent, deletePermission } from '@/api/super-admin/permission'
	import { deleteEffect } from '@/effect/delete'
	import { pageEffect } from '@/effect/page'
	import { showFormEffect } from '@/effect/show-form'
	import { PermissionModel } from '@/types/super-admin/permission'
	import { dateHandler } from '@/utils/format'
	import { toast } from '@/utils/toast'
	import { error } from 'console'
	import PermissionForm from './permission-form.vue'

	const loadChildren = async (
		row: PermissionModel,
		treeNode: unknown,
		resolve: (date: PermissionModel[]) => void
	) => {
		resolve(await getPermissionsByParent(row.id))
	}

	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(getPermissionList)
	const { deleteHandler } = deleteEffect(deletePermission, async () => tableCloseHandler(true), '此权限')

	onMounted(async () => {
		await fetchHandler()
	})

	const parentId = ref(-1)
	const permissionActive = ref<PermissionModel | null>(null)
	const { showExtraHandler, closeHandler, showModel } = showFormEffect(permissionActive, fetchHandler, parentId)
	const tableDOM = ref()

	const tableDeleteHandler = (pid: number) => {
		if (tableData.value && tableDOM.value) {
			const isTable = tableData.value.map(i => i.id).includes(pid)
			if (isTable) {
				deleteHandler(pid)
			} else {
				const treeNodeMap = tableDOM.value.store.states.lazyTreeNodeMap
				const mapKeys = Object.keys(treeNodeMap.value)
				for (let i = 0; i < mapKeys.length; i++) {
					const mapKey = mapKeys[i]
					const resultIndex = treeNodeMap.value[mapKey].findIndex((i: any) => i.id === pid)
					if (resultIndex !== -1) {
						const deleteItem = treeNodeMap.value[mapKey][resultIndex]
						if (deleteItem.hasChildren) {
							deleteHandler(pid)
						} else {
							deleteHandler(pid, false).then(status => {
								if (status === 'ok') treeNodeMap.value[mapKey].splice(resultIndex, 1)
							})
						}
						break
					}
				}
			}
		}
	}

	const tableCloseHandler = (refresh: boolean) => {
		if (refresh && tableDOM.value) {
			if ((permissionActive.value !== null && permissionActive.value.parentId) || parentId.value !== -1) {
				const { store } = tableDOM.value
				if (parentId.value !== -1) {
					if (tableData.value && tableData.value.map(t => t.id).includes(parentId.value)) {
						closeHandler(refresh)
					} else if (store.states.treeData.value[parentId.value]) {
						tableDOM.value.toggleRowExpansion({ id: parentId.value }, false)
						store.states.treeData.value[parentId.value].loaded = false
						closeHandler(false)
					} else {
						const keys = Object.keys(store.states.treeData.value)
						for (let i = 0; i < keys.length; i++) {
							const key = keys[i]
							if (store.states.treeData.value[key].children.includes(`${parentId.value}`)) {
								tableDOM.value.toggleRowExpansion({ id: key }, false)
								store.states.treeData.value[key].loaded = false
							}
						}
						closeHandler(false)
					}
				} else if (permissionActive.value !== null && permissionActive.value.parentId) {
					tableDOM.value.toggleRowExpansion({ id: permissionActive.value.parentId }, false)
					store.states.treeData.value[permissionActive.value.parentId].loaded = false
					closeHandler(false)
				}
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
				class="list-table-container"
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
							@click="tableDeleteHandler(row.id)"
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
