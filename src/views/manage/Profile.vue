<template>
	<div class="profile-container">
		<PreLoader v-if="isLoading"/>
		<v-form ref="profileForm">
			<template v-if="mode === 'profile'">
				<div class="change-passw"><span @click="switchMode('password')">Изменить пароль</span></div>
				<h3>Профиль</h3>
				<v-text-field
					outlined
					label="Имя"
					v-model="userObj.firstName"
					:rules="requiredRule"
				/>
				<v-text-field
					outlined
					label="Фамилия"
					v-model="userObj.lastName"
					:rules="requiredRule"
				/>
				<v-text-field
					outlined
					label="Отчество"
					v-model="userObj.middleName"
					:rules="requiredRule"
					v-if="userObj.middleName"
				/>
				<v-text-field
					outlined
					label="Email"
					v-model="userObj.email"
					:rules="requiredRule"
				/>
				<v-text-field
					outlined
					label="Телефон"
					v-model="userObj.phone"
					:rules="requiredRule"
					v-if="userObj.phone"
				/>
				<v-text-field
					outlined
					label="Филиал"
					v-model="userObj.departments[0].title"
					v-if="userObj.departments.length"
					readonly
				/>
				<v-text-field
					outlined
					label="Роль"
					v-model="userProfile.roleTitle"
					readonly
				/>
				<div class="d-flex justify-center">
					<button class="btn green-primary" @click.prevent="submitUser">Сохранить</button>
				</div>
			</template>
			<template v-if="mode === 'password'">
				<h3>Изменить пароль</h3>
				<v-text-field
					outlined
					label="Введите новый пароль"
					v-model="userObj.password"
					:rules="requiredRule"
				/>
				<div class="btn-actions">
					<button class="btn red-primary" @click.prevent="switchMode('profile')">Назад</button>
					<button class="btn green-primary" @click.prevent="submitUser">Изменить</button>
				</div>
			</template>
		</v-form>
	</div>
</template>

<script>
	import {UserService} from '../../services/user.service';

	export default {
		data() {
			return {
				requiredRule: [(v) => !!v || 'Обязательное поле'],
				isLoading: false,
				userObj: {
					departmentIds: [],
					roleIds: [],
					departments: [{title: ''}]
				},
				mode: 'profile'
			}
		},
		computed: {
			userProfile() {
				return this.$store.state.account.user;
			}
		},
		created() {
			this.getMyProfile();
		},
		methods: {
			async getMyProfile() {
				try {
					this.isLoading = true;
					this.userObj = await UserService.fetchMyProfile();
					console.log(this.userObj);
					this.userObj.departmentIds = this.userObj.departments.length ?  [this.userObj.departments[0].id] : [];
					this.userObj.position = this.userProfile.roleTitle;
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			},

			switchMode(mode) {
				this.mode = mode;
				if (mode === 'password') {
					this.getMyProfile();
				}
				if (mode === 'profile') {
					delete this.userObj.password;
				}
				this.$nextTick(() => {
					this.$refs.profileForm.resetValidation();
				});
			},

			async submitUser() {
				if (this.$refs.profileForm.validate()) {
					try {
						this.isLoading = true;
						await UserService.updateUser(this.userObj);
						this.$toast.success(this.mode === 'profile' ? 'Успешно обновлено!' : 'Пароль изменен!');
						this.switchMode('profile');
						this.isLoading = false;
					} catch (err) {
						this.$toast.error(err);
						this.isLoading = false;
					}
				}
			},

		}
	}
</script>

<style lang="scss">
	.profile-container {
		.change-passw {
			text-align: right;
			span {
				color: gray;
				border: 1px solid;
				border-radius: 4px;
				padding: 2px 5px;
				cursor: pointer;
			}
		}
		.v-form {
			background: #fff;
			max-width: 700px;
			margin: 0 auto;
			padding: 20px;
			border-radius: 5px;
		}
	}
</style>