<template>
	<div class="header-container">
		<div class="header-content">
			<div class="notify">
				<img src="../../assets/icons/ring-bell.svg">
			</div>
			<div class="fio" v-if="userProfile.user">
				<div class="name">{{userProfile.user.firstName + ' ' + userProfile.user.lastName}}</div>
				<div class="type">{{userProfile.roleTitle}}</div>
			</div>
			<div class="avatar">
				<img src="../../assets/icons/avatar.svg">
			</div>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		userProfile() {
			return this.$store.state.account.user;
		}
	}
};
</script>

<style lang="scss">
	.header-container {
		background: #fff;
		.header-content {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			height: 72px;
			padding: 0 16px;
			.fio {
				margin: 0 16px 0 25px;
				border-left: 1px solid #C2C9D1;
				padding-left: 25px;
				.name {
					font-size: 16px;
				}
				.type {
					font-size: 12px;
					color: #778192;
				}
			}
		}
	}
</style>