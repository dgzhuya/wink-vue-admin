<script lang="ts" setup>
	import { AdminMenuItem } from '@/types'

	defineProps<{ route: AdminMenuItem }>()
</script>
<template>
	<el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
		<template #title>
			<menu-item :icon="route.icon" :title="route.title"></menu-item>
		</template>
		<sidebar-item v-for="item in route.children" :key="item.path" :route="item"></sidebar-item>
	</el-sub-menu>
	<el-menu-item v-else :index="route.path">
		<menu-item :icon="route.icon" :title="route.title"></menu-item>
	</el-menu-item>
</template>
