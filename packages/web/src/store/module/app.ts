import { TAGS_VIEW } from '@/constants'
import router from '@/router'
import { TagItem } from '@/types'
import { getItem, setItem } from '@/utils/store'
import { defineStore } from 'pinia'

export const useApp = defineStore('app', {
	state: () => {
		return {
			sidebarOpened: true,
			tagViewList: (getItem(TAGS_VIEW) || []) as TagItem[]
		}
	},
	getters: {
		sideBarStatus: state => state.sidebarOpened,
		tagViews: state => state.tagViewList,
		showTags: state => state.tagViewList.length > 1
	},
	actions: {
		trigerSidebarOpened() {
			this.$state.sidebarOpened = !this.$state.sidebarOpened
		},
		addTagView(tag: TagItem) {
			const isFind = this.$state.tagViewList.find(tagView => tagView.fullPath === tag.fullPath)
			if (!isFind) {
				this.$state.tagViewList.push(tag)
				setItem(TAGS_VIEW, this.$state.tagViewList)
			}
		},
		async removeTagView(index: number, type: 'other' | 'right' | 'index' = 'index') {
			const len = this.$state.tagViewList.length
			if (index >= 0 && index < len) {
				switch (type) {
					case 'index':
						this.$state.tagViewList.splice(index, 1)
						break
					case 'other':
						this.$state.tagViewList.splice(0, index)
						if (index !== len - 1) {
							this.$state.tagViewList.splice(index + 1, len)
						}
						break
					case 'right':
						if (index === len - 1) {
							return
						}
						this.$state.tagViewList.splice(index + 1, len - index - 1)
						break
				}
				const lastTag = this.$state.tagViewList[this.$state.tagViewList.length - 1]
				await router.push(lastTag.path)
				setItem(TAGS_VIEW, this.$state.tagViewList)
			}
		}
	}
})
