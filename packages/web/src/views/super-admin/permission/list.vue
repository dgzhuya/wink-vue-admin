<template>
	<div class="user-manage-container">
		<el-card class="header">
			<el-button type="primary" @click="showExtraHandler(-1)">添加权限</el-button>
		</el-card>
		<el-card>
			<el-table
				row-key="id"
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
				<el-table-column label="操作" fixed="right" width="260">
					<template #default="{ row }">
						<el-button type="primary" @click="showExtraHandler(-1, row)" size="small">编辑</el-button>
						<el-button type="success" @click="showExtraHandler(row.id)" size="small">添加</el-button>
						<el-button type="danger" size="small">删除</el-button>
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
			@close="closeHandler"
		></permission-form>
	</div>
</template>

<script lang="ts" setup>
	import { getPermissionList, getPermissionsByParent } from '@/api/super-admin/permission'
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
	onMounted(async () => {
		await fetchHandler()
	})

	const parentId = ref(-1)
	const permissionActive = ref<PermissionModel | null>(null)
	const { showExtraHandler, closeHandler, showModel } = showFormEffect(permissionActive, fetchHandler, parentId)
</script>

<style lang="scss" scoped>
	.user-manage-container {
		.header {
			margin-bottom: 22px;
			text-align: right;
		}

		.avatar-icon {
			width: 40px;
			height: 40px;
			border-radius: 10px;
		}
	}
</style>
