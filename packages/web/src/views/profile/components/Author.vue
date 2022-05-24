<script lang="ts" setup>
	import { useUser } from '@/store/module/user'
	import { storeToRefs } from 'pinia'

	const { info } = storeToRefs(useUser())
</script>
<template>
	<div>{{ info.username }}</div>
	<div>{{ info.address }}</div>
	<div>{{ info.createTime }}</div>
	<div>{{ info.gender }}</div>
	<div>{{ info.mobile }}</div>
	<div v-for="role in info.roles" :key="role.id">{{ role.title }}</div>
	<el-button type="success">重置密码</el-button>
</template>
<style lang="scss" scoped></style>
