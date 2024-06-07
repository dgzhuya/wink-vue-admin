<script lang="ts" setup>
	import { getPluginList, deletePlugin } from '@web/api/tool/plugin'
	import PluginForm from './plugin-form.vue'
	import { pageEffect } from '@web/effect/page'
	import { dateHandler } from '@web/utils/format'
	import { PluginModel } from '@web/types/tool/plugin'
	import { showFormEffect } from '@web/effect/show-form'
	import { deleteEffect } from '@web/effect/delete'
	import { useUser } from '@web/store/module/user'
	import { toast } from '@web/utils/toast'
	import { webScoket } from '@web/utils/webSocket'

	const pluginActive = ref<PluginModel | null>(null)
	const { tableData, size, page, total, pageHandler, sizeHandler, fetchHandler } = pageEffect(getPluginList)

	const { showHandler, showModel, closeHandler } = showFormEffect(pluginActive, fetchHandler)
	const { deleteHandler } = deleteEffect(
		async id => {
			const result = await deletePlugin(id)
			if (result.length > 0) {
				webScoket(result)
			}
		},
		fetchHandler,
		'此插件'
	)
	onMounted(async () => {
		await fetchHandler()
	})

	const uploadUrl = `${import.meta.env.VITE_BASE_URL}/plugin`

	const user = useUser()
	const uploadDOM = ref()
	const failHandler = () => {
		if (uploadDOM.value) {
			uploadDOM.value.clearFiles()
		}
	}
	const successHandler = (response: any) => {
		if (response.code !== 200) {
			toast(response.msg)
		} else {
			if (response.data && response.data.length > 0) webScoket(response.data)
			if (uploadDOM.value) {
				uploadDOM.value.clearFiles()
				fetchHandler()
			}
		}
	}

	const genPluginUrl = (fileName: string) => `${window.location.protocol}//${window.location.host}/server/${fileName}`
</script>

<template>
	<div class="list-container">
		<el-card v-permission="['tool_plugin_add']" class="list-header">
			<el-upload
				ref="uploadDOM"
				:headers="{ Authorization: user.getToken }"
				:show-file-list="false"
				:on-success="successHandler"
				:on-error="failHandler"
				accept="*.wks"
				:action="uploadUrl"
			>
				<el-button type="primary">添加插件</el-button>
			</el-upload>
		</el-card>
		<el-card>
			<el-table :data="tableData" border class="list-table-container">
				<el-table-column prop="id" label="id"> </el-table-column>
				<el-table-column prop="name" label="插件名称"> </el-table-column>
				<el-table-column prop="description" label="插件描述"> </el-table-column>
				<el-table-column label="插件地址" :width="180">
					<template #default="{ row }">
						<a style="color: #3295fa; text-decoration: underline" :href="genPluginUrl(row.url)">点击下载</a>
					</template>
				</el-table-column>
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
					v-permission="['tool_plugin_update', 'tool_plugin_delete']"
					label="操作"
					fixed="right"
					width="260"
				>
					<template #default="{ row }">
						<el-button
							v-permission="['tool_plugin_update']"
							type="primary"
							@click="showHandler(row)"
							size="small"
							>编辑</el-button
						>
						<el-button
							v-permission="['tool_plugin_delete']"
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
		<plugin-form @close="closeHandler" :plugin="pluginActive" :show-form="showModel"></plugin-form>
	</div>
</template>

<style lang="scss" scoped>
	@import '@web/style/table.scss';
</style>
