<script lang="ts" setup>
	import { useUser } from '@/store/module/user'
	import { storeToRefs } from 'pinia'
	import PanThumb from '@/components/PanThumb/index.vue'

	const { info } = storeToRefs(useUser())
</script>
<template>
	<el-card class="user-container">
		<template #header>
			<div class="header">
				<span>介绍</span>
			</div>
		</template>
		<div class="user-profile">
			<div class="box-center">
				<pan-thumb :image="info.avatar" height="100px" width="100px">
					<div>wink</div>
				</pan-thumb>
			</div>
			<div class="box-center">
				<div class="user-name text-center">
					{{ info.nickname }}
				</div>
				<div class="user-role text-center text-muted">
					{{ info.username }}
				</div>
			</div>
		</div>
	</el-card>
</template>
<style lang="scss" scoped>
	.user-container {
		.text-muted {
			font-size: 14px;
			color: #777;
		}

		.user-profile {
			text-align: center;

			.user-name {
				font-size: bold;
			}

			.box-center {
				padding-top: 10px;
			}

			.user-role {
				padding-top: 10px;
				font-weight: 400px;
			}
		}
	}
</style>
