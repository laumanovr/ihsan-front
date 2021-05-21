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
	},
	computed: {
		userProfile() {
			return this.$store.state.account.user;
		}
	},
	mounted() {
		if (this.userProfile.roles) {
			this.$store.dispatch('account/getUserPermissions', {roleId: this.userProfile.roles[0].id});
		}
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
				padding: 16px 16px 30px;
			}
		}
	}
</style>