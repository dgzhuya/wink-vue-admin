<script lang="ts" setup>
	import { getPermissionTree } from '@web/api/super-admin/permission'
	import { getRolePermissions, setRolePermission } from '@web/api/super-admin/role'
	import { PermissionTree } from '@web/types/super-admin/permission'

	const premissionTree = ref<PermissionTree[]>([])
	const roleProps = withDefaults(defineProps<{ show: boolean; rid: number }>(), {
		show: false,
		rid: 0
	})
	const roleEmit = defineEmits<{ (e: 'update:show', val: boolean): void }>()

	const treeSelectDom = ref()
	const activeRid = ref(0)

	const reset = () => {
		if (treeSelectDom.value) {
			const keys = treeSelectDom.value.getCheckedKeys()
			keys.forEach((key: any) => {
				treeSelectDom.value.setChecked(key.id, false)
			})
		}
	}

	watchEffect(async () => {
		if (roleProps.rid !== 0) {
			if (activeRid.value !== roleProps.rid) {
				reset()
				activeRid.value = roleProps.rid
				const result = await getRolePermissions(activeRid.value)
				treeSelectDom.value.setCheckedKeys(result)
			}
		}
	})

	onMounted(async () => {
		premissionTree.value = await getPermissionTree()
	})

	const cancelClick = () => {
		roleEmit('update:show', false)
	}

	const confirmClick = async () => {
		if (treeSelectDom.value) {
			const keys = treeSelectDom.value.getCheckedKeys()
			await setRolePermission(activeRid.value, keys)
			window.location.href = ''
		}
		cancelClick()
	}
</script>
<template>
	<el-drawer @closed="cancelClick()" :model-value="show" direction="rtl">
		<template #header>
			<h4>设置角色权限</h4>
		</template>
		<template #default>
			<el-tree-v2
				ref="treeSelectDom"
				:props="{ value: 'id', label: 'title', children: 'children' }"
				:data="premissionTree"
				:height="600"
				check-on-click-node
				show-checkbox
				check-strictly
			></el-tree-v2>
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="cancelClick()">取消</el-button>
				<el-button type="primary" @click="confirmClick()">确认</el-button>
			</div>
		</template>
	</el-drawer>
</template>
