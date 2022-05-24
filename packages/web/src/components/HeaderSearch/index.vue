<script lang="ts" setup>
	import { AdminMenuItem } from '@/types'
	import { generateMenus, filterRouters } from '@/utils/route'
	import { ElSelect } from 'element-plus'
	import Fuse from 'fuse.js'

	const isShow = ref(false)
	const headerSearchSelectDom = ref<HTMLInputElement>()
	const onShowClick = () => {
		isShow.value = !isShow.value
		if (headerSearchSelectDom.value) {
			headerSearchSelectDom.value.focus()
		}
	}

	const search = ref('')
	const searchOptions = ref<AdminMenuItem[]>([])

	const querySearch = (query: string) => {
		if (query !== '') {
			const searchResult = fuse.search(query)
			if (searchResult) searchOptions.value = searchResult.map(search => search.item)
			else searchOptions.value = []
		} else {
			searchOptions.value = []
		}
	}

	const onSelectChange = (path: string) => {
		router.push(path)
	}

	const onClose = () => {
		if (headerSearchSelectDom.value) {
			headerSearchSelectDom.value.blur()
		}
		isShow.value = false
		searchOptions.value = []
	}

	watchEffect(() => {
		if (isShow.value) {
			document.body.addEventListener('click', onClose)
		} else {
			document.body.removeEventListener('click', onClose)
		}
	})

	const router = useRouter()
	const searchPool = computed(() => generateMenus(filterRouters(router.getRoutes())))
	const fuse = new Fuse(searchPool.value, {
		shouldSort: true,
		minMatchCharLength: 1,
		fieldNormWeight: 0.8,
		keys: [
			{
				name: 'title',
				weight: 0.7
			},
			{
				name: 'path',
				weight: 0.3
			}
		]
	})
</script>
<template>
	<div :class="{ show: isShow }" class="header-search">
		<svg-icon class-name="search-icon" icon="search" @click.stop="onShowClick()"></svg-icon>
		<el-select
			ref="headerSearchSelectDom"
			class="header-search-select"
			v-model="search"
			filterable
			default-first-option
			remote
			clearable
			placeholder="Search"
			:remote-method="querySearch"
			@change="onSelectChange"
		>
			<el-option
				v-for="option in searchOptions"
				:key="option.path"
				:label="option.title"
				:value="option.path"
			></el-option>
		</el-select>
	</div>
</template>
<style lang="scss" scoped>
	.header-search {
		font-size: 0 !important;

		.search-icon {
			cursor: pointer;
			font-size: 18px;
			vertical-align: middle;
		}

		.header-search-select {
			font-size: 18px;
			transition: width 0.2s;
			width: 0;
			overflow: hidden;
			background: transparent;
			border-radius: 0;
			display: inline-block;
			vertical-align: middle;

			:deep(.el-input__wrapper) {
				box-shadow: none !important;

				.el-input__inner {
					border-radius: 0;
					border: none;
					padding-left: 0;
					padding-right: 0;
					box-shadow: none !important;
					border-bottom: 1px solid #d9d9d9;
					vertical-align: middle;
				}
			}
		}

		&.show {
			.header-search-select {
				width: 210px;
				margin-left: 10px;
			}
		}
	}
</style>
