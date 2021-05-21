<template>
	<div class="users-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<span>Пользователи</span>
			<button
				class="btn blue-primary"
				@click="toggleUserModal('add')"
				v-if="permissions.some(i => i.code === 'user-create')"
			>
				Добавить пользователя
			</button>
		</div>

		<table class="table">
			<thead>
			<tr>
				<th>#</th>
				<th>ФИО</th>
				<th>Роль</th>
				<th>Филиал</th>
				<th>Email</th>
				<th>Телефон</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(user, i) in allUsers" :key="user.id">
				<td>{{i + 1}}</td>
				<td>{{user.lastName+' '+user.firstName}}</td>
				<td>{{user.position}}</td>
				<td>{{user.departmentList[0]}}</td>
				<td>{{user.email}}</td>
				<td>{{user.phone}}</td>
				<td class="actions">
					<img
						src="../../assets/icons/edit-icon.svg"
						title="Редактировать"
						@click="toggleUserModal('edit', user)"
						v-if="permissions.some(i => i.code === 'user-edit')"
					>
					<img
						class="reset-icon"
						title="Сбросить пароль"
						src="../../assets/icons/unlock.svg"
						@click="resetPass(true, user)"
						v-if="permissions.some(i => i.code === 'reset-pass')"
					>
				</td>
			</tr>
			</tbody>
		</table>

		<!--USER MODAL-->
		<modal name="user-modal" height="97%">
			<div class="modal-container">
				<h3>{{mode === 'add' ? 'Добавить пользователя' : 'Редактировать'}}</h3>
				<v-form ref="userForm">
					<v-text-field
						outlined
						label="Имя"
						v-model="userObj.firstName"
						:rules="requiredRule"
						placeholder="Минимум 4 символов"
					/>
					<v-text-field
						outlined
						label="Фамилия"
						v-model="userObj.lastName"
						:rules="requiredRule"
						placeholder="Минимум 4 символов"
					/>
					<v-text-field
						outlined
						label="Отчество"
						v-model="userObj.middleName"
						:rules="requiredRule"
						placeholder="Минимум 4 символов"
					/>
					<v-text-field
						outlined
						label="Email"
						v-model="userObj.email"
						:rules="emailRule"
						autocomplete="new-password"
					/>
					<v-text-field
						outlined
						label="Пароль"
						v-model="userObj.password"
						:rules="requiredRule"
						type="password"
						v-if="mode === 'add'"
						autocomplete="new-password"
					/>
					<v-select
						outlined
						label="Филиал"
						item-text="title"
						item-value="id"
						:items="departments"
						:rules="requiredRule"
						v-model="userObj.departmentList[0]"
					/>
					<v-select
						outlined
						label="Роль"
						item-text="title"
						item-value="id"
						:items="roles"
						v-model="userObj.roleId"
						:rules="requiredRule"
					/>
					<v-text-field
						outlined
						label="Телефон"
						v-model="userObj.phone"
						:rules="requiredRule"
						type="number"
					/>
				</v-form>
				<div class="btn-actions">
					<button class="btn red-primary" @click="toggleUserModal">Отмена</button>
					<button class="btn green-primary" @click="submitSaveUser">Сохранить</button>
				</div>
			</div>
		</modal>

		<!--RESET PASSWORD MODAL-->
		<modal name="reset-pass-modal" width="400px" height="auto">
			<div class="modal-container">
				<h3>Сбросить пароль этого пользователя? <br> Пароль будет сброшен на: 111111</h3>
				<div class="btn-actions">
					<button class="btn red-primary" @click="$modal.hide('reset-pass-modal')">Отмена</button>
					<button class="btn green-primary" @click="resetPass(false)">Сбросить</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import {UserService} from '../../services/user.service';
import {DepartmentService} from '../../services/department.service';
import {RoleService} from '../../services/role.service';

export default {
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
			userObj: {
				firstName: '',
				lastName: '',
				middleName: '',
				email: '',
				password: '',
				departmentList: [],
				phone: '',
				roleId: 0,
				address: '',
				birthday: '',
				position: '',
				profileType: ''
			},
			mode: '',
			allUsers: [],
			departments: [],
			roles: []
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.user;
		},
		permissions() {
			if (this.userProfile.permissions) {
				return this.userProfile.permissions.filter(i => i.sidebar.href === this.$route.path);
			}
			return [];
		}
	},
	created() {
		this.getDepartmentList();
		this.getRoleList();
		this.getAllUsers();
	},
	methods: {
		async getAllUsers() {
			try {
				this.isLoading = true;
				this.allUsers = await UserService.fetchUserList();
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getDepartmentList() {
			try {
				this.departments = await DepartmentService.fetchDepartmentList();
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getRoleList() {
			try {
				const res = await RoleService.fetchAllRoles();
				this.roles = res.filter((role) => role.code !== 'ROLE_SUPER_ADMIN');
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async toggleUserModal(mode, user) {
			this.mode = mode;
			if (mode === 'add') {
				this.userObj = {departmentList: [''], birthday: '01.01.1970'};
			}
			if (mode === 'edit') {
				try {
					this.isLoading = true;
					const res = await UserService.findById(user.id);
					this.userObj = res;
					this.userObj.roleId = res.roleIds[0];
					this.userObj.departmentList = [res.departments[0].id];
					this.userObj.birthday = '01.01.1970';
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
				}
			}
			this.$modal.toggle('user-modal');
		},

		async resetPass(isConfirm, user) {
			if (isConfirm) {
				try {
					this.isLoading = true;
					const res = await UserService.findById(user.id);
					this.userObj = res;
					this.userObj.departmentIds = [res.departments[0].id];
					this.userObj.birthday = '01.01.1970';
					this.userObj.password = '111111';
					this.userObj.departmentList = [];
					this.isLoading = false;
					this.$modal.show('reset-pass-modal');
					return;
				} catch (err) {
					this.$toast.error(err);
					return;
				}
			}
			try {
				this.isLoading = true;
				await UserService.updateUser(this.userObj);
				this.$toast.success('Пароль сброшен!');
				this.$modal.hide('reset-pass-modal');
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async submitSaveUser() {
			if (this.$refs.userForm.validate()) {
				this.userObj.position = this.roles.find(i => i.id === this.userObj.roleId).title;
				try {
					this.isLoading = true;
					if (this.mode === 'add') {
						await UserService.createUser(this.userObj);
					} else {
						this.userObj.roleIds = [this.userObj.roleId];
						this.userObj.departmentIds = this.userObj.departmentList;
						await UserService.updateUser(this.userObj);
					}
					this.toggleUserModal();
					this.getAllUsers();
					this.$toast.success(this.mode === 'add' ? 'Успешно создано!' : 'Успешно обновлено!');
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		}
	}
};
</script>

<style lang="scss">
	.users-container {
		.vm--modal {
			max-height: 650px;
		}
		.actions {
			img {
				cursor: pointer;
				&.reset-icon {
					width: 22px;
					margin-left: 10px;
				}
			}
		}
	}
</style>