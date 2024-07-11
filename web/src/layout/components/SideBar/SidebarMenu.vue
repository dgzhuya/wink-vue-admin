<script lang="ts" setup>
	import { filterRouters, generateMenus } from '@web/utils/route'
	import SidebarItem from './SidebarItem.vue'
	import { useTheme } from '@web/store/module/theme'
	import { useApp } from '@web/store/module/app'
	import { storeToRefs } from 'pinia'

	const { cssVar } = storeToRefs(useTheme())
	const router = useRouter()
	const route = useRoute()
	const app = useApp()
	const activeMenu = computed(() => route.path)
	const routes = computed(() => generateMenus(filterRouters(router.getRoutes())))
</script>
<template>
	<el-menu
		:unique-opened="true"
		:collapse="!app.sideBarStatus"
		:default-active="activeMenu"
		:background-color="cssVar.menuBg"
		:text-color="cssVar.menuText"
		:active-text-color="cssVar.menuActiveText"
		:collapse-transition="false"
		router
	>
		<sidebar-item v-for="route in routes" :route="route" :key="route.path"></sidebar-item>
	</el-menu>
</template>
<style lang="scss" scoped>
	.el-menu {
		border-right: none;
	}
</style>
