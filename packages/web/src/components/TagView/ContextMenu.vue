<script lang="ts" setup>
	import { useApp } from '@/store/module/app'

	defineProps<{ index: number }>()

	const router = useRouter()
	const onRefreshClick = () => {
		router.go(0)
	}
	const route = useRoute()

	const { removeTagView } = useApp()
</script>
<template>
	<ul class="context-menu-container">
		<li @click="onRefreshClick">刷新</li>
		<li @click="removeTagView(index, route.fullPath, 'right')">关闭右边</li>
		<li @click="removeTagView(index, route.fullPath, 'other')">关闭其他</li>
	</ul>
</template>
<style lang="scss" scoped>
	.context-menu-container {
		position: fixed;
		background-color: #fff;
		z-index: 3000;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

		li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;

			&:hover {
				background: #eee;
			}
		}
	}
</style>
