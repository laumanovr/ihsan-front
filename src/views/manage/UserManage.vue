<template>
	<div class="user-manage-container">
		<Sidebar/>
		<div class="manage-content">
			<Header/>
			<div class="main-content">
				<router-view/>
			</div>
		</div>
	</div>
</template>

<script>
import Sidebar from '@/components/general/Sidebar';
import Header from '@/components/general/Header';

export default {
	components: {
		Sidebar,
		Header
	}
};
</script>

<style lang="scss">
	.user-manage-container {
		background: #E5E5E5;
		display: flex;
		.manage-content {
			width: 100%;
			.main-content {
				padding: 0 16px;
			}
		}
	}
</style>