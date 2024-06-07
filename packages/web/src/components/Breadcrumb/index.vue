<script lang="ts" name="breadcrumb" setup>
	import { useTheme } from '@web/store/module/theme'

	const router = useRouter()
	const route = useRoute()

	const breadcurmbData = computed(() => route.matched.filter(item => item.meta && item.meta.title))
	const linkHoverColor = useTheme().cssVar.menuBg
</script>
<template>
	<el-breadcrumb class="breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item, index) in breadcurmbData" :key="item.path">
				<span v-if="index === breadcurmbData.length - 1" class="no-redirect">{{ item.meta.title }}</span>
				<a v-else class="redirect" @click.prevent="router.push(item.path)">{{ item.meta.title }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>
<style lang="scss" scoped>
	@import '@web/style/transion.scss';

	.breadcrumb {
		display: inline-block;
		font-size: 14px;
		line-height: $navbarHeight;
		margin-left: 8px;

		:deep(.no-redirect) {
			color: #97a8be;
			cursor: text;
		}

		.redirect {
			color: #666;
			font-weight: 600;

			&:hover {
				color: v-bind(linkHoverColor);
			}
		}
	}
</style>
