export const listSource = `<template>
	<div class="%moduleName%-container">
		<el-card v-permission="['%parentPath%_%moduleName%_add']" class="header">
			<el-button v-permission="['%parentPath%_%moduleName%_add']" @click="showHandler()" type="primary"
				>添加%moduleComment%</el-button
			>
		</el-card>
		<el-card>
			<el-table :data="tableData" border style="margin-bottom: 10px">
%tableFieldStr%				<el-table-column
					v-permission="['%parentPath%_%moduleName%_update', '%parentPath%_%moduleName%_delete']"
					label="操作"
					fixed="right"
					width="260"
				>
					<template #default="{ row }">
						<el-button
							v-permission="['%parentPath%_%moduleName%_update']"
							type="primary"
							@click="showHandler(row)"
							size="small"
							>编辑</el-button
						>
						<el-button
							v-permission="['%parentPath%_%moduleName%_delete']"
							@click="deleteHandler(row.id)"
							type="danger"
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
		<%moduleName%-form @close="closeHandler" :%moduleName%="%moduleName%Active" :show-form="showModel"></%moduleName%-form>
	</div>
</template>

<script lang="ts" setup>
	import { get%upperModuleName%List, set%upperModuleName%Roles, delete%upperModuleName% } from '@/api/%parentPath%/%moduleName%'
	import %upperModuleName%Form from './%moduleName%-form.vue'
	import { pageEffect } from '@/effect/page'
	import { dateHandler } from '@/utils/format'
	import { %upperModuleName%Model } from '@/types/%parentPath%/%moduleName%'
	import { showFormEffect } from '@/effect/show-form'
	import { deleteEffect } from '@/effect/delete'

	const %moduleName%Active = ref<%upperModuleName%Model | null>(null)
	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(get%upperModuleName%List)

	const { showHandler, showModel, closeHandler } = showFormEffect(%moduleName%Active, fetchHandler)
	const { deleteHandler } = deleteEffect(delete%upperModuleName%, fetchHandler, '此%moduleComment%')
	onMounted(async () => {
		await fetchHandler()
	})
</script>

<style lang="scss" scoped>
	.%moduleName%-container {
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
`
