<script lang="ts" name="tag-view" setup>
	import { storeToRefs } from 'pinia'
	import { useApp } from '@web/store/module/app'
	import { useTheme } from '@web/store/module/theme'
	import ContextMenu from './ContextMenu.vue'

	const route = useRoute()
	const { cssVar } = storeToRefs(useTheme())
	const { tagViewList, showTags } = storeToRefs(useApp())
	const isActive = (tagPath: string) => tagPath === route.fullPath
	const { removeTagView } = useApp()

	const selectIndex = ref(0)
	const visible = ref(false)
	const menuStyle = reactive({
		left: '',
		top: ''
	})

	const openMenu = (event: PointerEvent, index: number) => {
		const { x, y } = event
		menuStyle.left = x + 'px'
		menuStyle.top = y + 'px'
		selectIndex.value = index
		visible.value = true
	}

	watchEffect(() => {
		if (visible.value) {
			document.body.addEventListener('click', () => (visible.value = false))
		} else {
			document.body.removeEventListener('click', () => (visible.value = false))
		}
	})
</script>
<template>
	<div class="tags-view-container" :class="showTags ? 'show-tags' : 'hidden-tags'">
		<router-link
			class="tags-view-item"
			:class="isActive(tag.fullPath) ? 'active' : ''"
			@contextmenu.prevent="openMenu($event, index)"
			:style="{
				backgroundColor: isActive(tag.fullPath) ? cssVar.menuBg : '',
				broderColor: isActive(tag.fullPath) ? cssVar.menuBg : ''
			}"
			v-for="(tag, index) in tagViewList"
			:key="tag.fullPath"
			:to="{ path: tag.fullPath }"
		>
			{{ tag.title }}
			<svg-icon
				icon="close"
				class-name="el-icon-close"
				@click.prevent.stop="removeTagView(index, route.fullPath)"
			></svg-icon>
		</router-link>
	</div>
	<context-menu v-show="visible" :style="menuStyle" :index="selectIndex"></context-menu>
</template>
<style lang="scss" scoped>
	.show-tags {
		height: $tagViewHeight;
	}

	.hidden-tags {
		height: 0;
	}
	.tags-view-container {
		width: 100%;
		transition: height $tagsViewDuration;
		overflow: hidden;
		background-color: #fff;
		border-bottom: 1px solid #d8dce5;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px rgba(0, 0, 0, 0.04);

		.tags-view-item {
			display: inline-block;
			position: relative;
			cursor: pointer;
			height: 26px;
			line-height: 26px;
			border: 1px solid #d8dce5;
			color: #495060;
			background-color: #fff;
			padding: 0 8px;
			font-size: 12px;
			margin-left: 5px;
			margin-top: 4px;

			&:first-of-type {
				margin-left: 15px;
			}

			&:last-of-type {
				margin-right: 15px;
			}

			&.active {
				color: #fff;

				&::before {
					content: ' ';
					background: #fff;
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					position: relative;
					margin-right: 4px;
				}
			}

			.el-icon-close {
				box-sizing: border-box;
				width: 16px;
				height: 16px;
				padding: 3px;
				vertical-align: -3px;
				transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
				border-radius: 50%;

				&:hover {
					background-color: #b4bccc;
					color: #fff;
				}
			}
		}
	}
</style>
