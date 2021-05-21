<template>
	<div class="department-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<span>Филиалы</span>
			<button
				class="btn blue-primary"
				@click="toggleTerritoryModal('add')"
				v-if="permissions.some(i => i.code === 'create-territory')"
			>
				Добавить территорию
			</button>
		</div>

		<div class="territory-content">
			<h3>Территория</h3>
			<div class="territory-block" v-for="territory in territories" :key="territory.id">
				<div class="territory-name d-flex justify-space-between" @click="expandDepart(territory)">
					<div class="d-flex align-center">
						<img src="../../assets/icons/arrow-right.svg" class="arrow-icon">
						<span>{{territory.title}}</span>
					</div>
					<div class="actions d-flex align-center justify-space-between">
						<button
							class="btn blue-primary"
							@click="toggleDepartmentModal('add', territory.id)"
							v-if="permissions.some(i => i.code === 'create-depart')"
						>
							Добавить филиал
						</button>
						<img
							src="../../assets/icons/edit-icon.svg"
							@click="toggleTerritoryModal('edit', territory)"
							v-if="permissions.some(i => i.code === 'edit-territory')"
						>
					</div>
				</div>
				<div class="departments" :class="{'expanded': territory.expanded}">
					<div
						class="department d-flex align-center justify-space-between"
						v-for="depart in territory.departments" :key="depart.id"
					>
						<span>{{depart.title}}</span>
						<div class="d-flex align-center">
							<img
								src="../../assets/icons/edit-icon.svg"
								title="Редактировать"
								@click="toggleDepartmentModal('edit', territory.id, depart)"
								v-if="permissions.some(i => i.code === 'edit-depart')"
							>
							<img
								src="../../assets/icons/users.svg"
								class="depart-user-icon"
								title="Работники"
								@click="showDepartmentUsers(depart)"
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--TERRITORY MODAL-->
		<modal name="territory-modal" height="auto">
			<div class="modal-container">
				<h3>{{mode === 'add' ? 'Добавить территорию' : 'Редактировать территорию'}}</h3>
				<v-form ref="territoryForm">
					<v-text-field
						outlined
						label="Название"
						v-model="territoryObj.title"
						:rules="requiredRule"
					/>
				</v-form>
				<div class="btn-actions">
					<button class="btn red-primary" @click="toggleTerritoryModal">Отмена</button>
					<button class="btn green-primary" @click="submitTerritory">Сохранить</button>
				</div>
			</div>
		</modal>

		<!--DEPARTMENT MODAL-->
		<modal name="department-modal" height="auto">
			<div class="modal-container">
				<h3>{{departMode === 'add' ? 'Добавить филиал' : 'Изменить филиал' }}</h3>
				<v-form ref="departForm">
					<v-text-field
						outlined
						label="Название филиала"
						v-model="departmentObj.title"
						:rules="requiredRule"
					/>
				</v-form>
				<div class="btn-actions">
					<button class="btn red-primary" @click="toggleDepartmentModal">Отмена</button>
					<button class="btn green-primary" @click="submitDepartment">Сохранить</button>
				</div>
			</div>
		</modal>

		<!--DEPARTMENT USERS MODAL-->
		<modal name="depart-users-modal" height="auto">
			<div class="modal-container">
				<div class="d-flex justify-end">
					<img src="../../assets/icons/close-icon.svg" @click="$modal.hide('depart-users-modal')">
				</div>
				<h3>Работники филиала: {{departmentObj.title}}</h3>
				<table class="table depart-users-table">
					<thead>
					<tr>
						<th>#</th>
						<th>ФИО</th>
						<th>Роль</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(user, i) in departmentUsers" :key="user.id">
						<td>{{i + 1}}</td>
						<td>{{user.lastName+' '+user.firstName}}</td>
						<td>{{user.roleTitle}}</td>
					</tr>
					</tbody>
				</table>
			</div>
		</modal>
	</div>
</template>

<script>
import {DepartmentService} from '../../services/department.service';
import {UserService} from '../../services/user.service';

export default {
	data() {
		return {
			isLoading: false,
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			mode: 'add',
			departMode: 'add',
			territories: [],
			departmentUsers: [],
			territoryObj: {
				title: '',
				comment: ''
			},
			departmentObj: {
				territoryId: 0,
				title: ''
			}
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
		this.getAllTerritories();
	},
	methods: {
		async getAllTerritories() {
			try {
				this.territories = [];
				this.isLoading = true;
				this.territories = await DepartmentService.fetchTerritoryList();
				const departments = await DepartmentService.fetchDepartmentList();
				this.territories.map((territory) => {
					territory.expanded = false;
					territory.departments = [];
					departments.forEach((depart) => {
						if (territory.id === depart.territoryId) {
							territory.departments.push(depart);
						}
						return territory;
					});
				});
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		toggleTerritoryModal(mode, item) {
			this.mode = mode;
			if (mode === 'add') {
				this.territoryObj.title = '';
			}
			if (mode === 'edit') {
				this.territoryObj.id = item.id;
				this.territoryObj.title = item.title;
			}
			this.$modal.toggle('territory-modal');
		},

		toggleDepartmentModal(mode, territoryId, depart) {
			this.departMode = mode;
			this.departmentObj.territoryId = territoryId;
			this.departmentObj.title = '';
			if (mode === 'edit') {
				this.departmentObj.title = depart.title;
				this.departmentObj.id = depart.id;
			}
			this.$modal.toggle('department-modal');
		},

		expandDepart(territory) {
			territory.expanded = !territory.expanded;
			this.$forceUpdate();
		},

		async submitTerritory() {
			if (this.$refs.territoryForm.validate()) {
				try {
					this.isLoading = true;
					if (this.mode === 'add') {
						await DepartmentService.createTerritory(this.territoryObj);
					} else {
						await DepartmentService.updateTerritory(this.territoryObj);
					}
					this.$toast.success(this.mode === 'add' ? 'Успешно создано!' : 'Успешно обновлено!');
					this.toggleTerritoryModal();
					this.getAllTerritories();
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		async submitDepartment() {
			if (this.$refs.departForm.validate()) {
				try {
					this.isLoading = true;
					if (this.departMode === 'add') {
						await DepartmentService.createDepartment(this.departmentObj);
					} else {
						await DepartmentService.updateDepartment(this.departmentObj);
					}
					this.$toast.success(this.departMode === 'add' ? 'Успешно создано!' : 'Успешно обновлено!');
					this.getAllTerritories();
					this.toggleDepartmentModal();
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		async showDepartmentUsers(depart) {
			try {
				this.isLoading = true;
				this.departmentObj.title = depart.title;
				this.departmentUsers = await UserService.fetchByDepartment(depart.id);
				this.$modal.show('depart-users-modal');
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss">
	.department-container {
		.head-title {
			.btn {
				max-width: 190px;
				font-size: 14px;
			}
		}
		.territory-content {
			background: #fff;
			border-radius: 5px;
			padding: 15px;
			margin-top: 20px;
			.territory-block {
				font-weight: 500;
				font-size: 14px;
				padding: 10px 0;
				border-top: 1px solid #C2C9D1;
				cursor: pointer;
				.territory-name {
					padding-bottom: 10px;
				}
				.arrow-icon {
					margin: 0 5px;
				}
				.actions {
					min-width: 250px;
					.btn {
						height: 28px;
						max-width: 150px;
						font-size: 13px;
					}
				}
				.departments {
					padding-left: 20px;
					max-height: 0;
					overflow-y: hidden;
					will-change: max-height;
					transition: max-height 0.2s ease-out;
					&.expanded {
						max-height: 500px;
						transition: max-height 0.3s ease-in;
					}
					.department {
						font-size: 13px;
						color: #202021;
						padding: 10px 0;
						border-top: 1px solid #C2C9D1;
						.depart-user-icon {
							width: 28px;
							margin-left: 10px;
						}
					}
				}
			}
		}
		.depart-users-table {
			table-layout: auto;
		}
		.vm--modal {
			max-height: 600px;
			overflow-y: auto;
		}
	}
</style>