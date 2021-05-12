<template>
	<div class="login-container">
		<PreLoader v-if="isLoading"/>
		<v-form class="login-form" ref="loginForm">
			<img src="../../assets/images/outer-logo.svg" class="logo">
			<v-text-field
				outlined
				label="Email"
				v-model="loginObj.email"
				autocomplete="new-password"
				:rules="emailRule"
			/>
			<v-text-field
				outlined
				label="Пароль"
				type="password"
				v-model="loginObj.password"
				autocomplete="new-password"
				:rules="requiredRule"
			/>
			<button class="btn blue-primary" @click.prevent="submitLogin">Войти</button>
		</v-form>
	</div>
</template>

<script>
import {mapState} from 'vuex';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^[a-zA-Z0-9()*_\-!#$%^&*,."'@\][]+$/.test(v) || 'Email должен быть на латинице',
				(v) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(v) || 'Email должен быть валидным';
				}
			],
			loginObj: {
				email: '',
				password: ''
			}
		};
	},
	computed: {
		...mapState('account', ['onError']),
	},
	methods: {
		submitLogin() {
			if (this.$refs.loginForm.validate()) {
				this.isLoading = true;
				this.$store.dispatch('account/userLogin', this.loginObj);
			}
		}
	},
	watch: {
		onError(msg) {
			if (msg) {
				this.isLoading = false;
				this.$toast.error(msg);
				this.$store.state.account.onError = '';
			}
		}
	}
};
</script>

<style lang="scss">
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		.login-form {
			width: 370px;
			text-align: center;
			transform: translateY(-4rem);
			.logo {
				margin-bottom: 40px;
			}
			.btn {
				height: 45px;
			}
		}
	}
</style>