<template>
	<modal name="logout-modal" width="450px" height="auto">
		<div class="modal-container">
			<h3>Выйти?</h3>
			<div class="btn-actions">
				<button class="btn blue-primary" @click="closeModal">Отмена</button>
				<button class="btn red-primary" @click="logOut">Выход</button>
			</div>
		</div>
	</modal>
</template>

<script>
export default {
	methods: {
		closeModal() {
			this.$modal.hide('logout-modal');
		},

		logOut() {
			this.$store.dispatch('account/logout');
		}
	}
};
</script>