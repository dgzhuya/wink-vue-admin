export const listSource = `<template>
	<div class="%moduleName%-container">
		<el-card class="header">
			<el-button @click="showHandler()" type="primary">添加%title%</el-button>
		</el-card>
		<el-card>
			<el-table :data="tableData" border style="margin-bottom: 10px">
%tableFieldStr%				<el-table-column label="操作" fixed="right" width="260">
					<template #default="{ row }">
						<el-button type="primary" @click="showHandler(row)" size="small">编辑</el-button>
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
		<%moduleName%-form :%moduleName%="%moduleName%Active" :show-form="showModel" @close="closeHandler"></%moduleName%-form>
	</div>
</template>

<script lang="ts" setup>
	import { get%upperModuleName%List } from '@/api/%parentPath%/%moduleName%'
	import { pageEffect } from '@/effect/page'
	import { %upperModuleName%Model } from '@/types/%parentPath%/%moduleName%'
	import { dateHandler } from '@/utils/format'
	import { showFormEffect } from '@/effect/show-form'
	import %upperModuleName%Form from './%moduleName%-form.vue'

	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(get%upperModuleName%List)
	onMounted(async () => {
		await fetchHandler()
	})

	const %moduleName%Active = ref<%upperModuleName%Model | null>(null)
	const { showHandler, showModel, closeHandler } = showFormEffect(%moduleName%Active, fetchHandler)
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
