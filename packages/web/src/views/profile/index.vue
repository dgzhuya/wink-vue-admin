<script lang="ts" setup>
	// import Fature from './components/Fature.vue'
	import ProjectCard from './components/ProjectCard.vue'
	import Author from './components/Author.vue'
	// import Chapter from './components/Chapter.vue'

	const activeName = ref('author')
</script>
<template>
	<div class="my-container">
		<el-row>
			<el-col :span="6">
				<project-card class="user-card"></project-card>
			</el-col>
			<el-col :span="18">
				<el-card>
					<el-tabs v-model="activeName">
						<!-- <el-tab-pane label="功能" name="fature">
							<fature></fature>
						</el-tab-pane>
						<el-tab-pane label="章节" name="chapter">
							<chapter></chapter>
						</el-tab-pane> -->
						<el-tab-pane label="用户信息" name="author">
							<author></author>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<style lang="scss" scoped>
	.my-container {
		.user-card {
			margin-right: 20px;
		}
	}
</style>
