<template>
	<div class="role-create">
		<PreLoader v-if="isLoading"/>
		<div class="d-flex align-center" @click="$router.go(-1)" style="cursor: pointer;">
			<img src="../../../assets/icons/arrow-dark.svg" style="margin-right: 15px">
			Назад
		</div>
		<div class="head-title text-center">Создать роль</div>
		<div class="create-role-content">
			<v-form ref="roleForm">
				<v-text-field
					outlined
					label="Название роли"
					v-model="roleObj.title"
					:rules="requiredRule"
				/>
				<v-text-field
					outlined
					label="Описание роли"
					v-model="roleObj.code"
				/>
				<h3>Доступы</h3>
				<div class="permissions">
					<div class="permission" v-for="(item, i) in allPermissions" :key="i">
						<div class="sidebar-title font-weight-bold">{{item.sidebarName}}</div>
						<div class="access-field" v-for="action in item.permissions" :key="action.id">
							<span>{{action.title}}</span>
							<v-switch v-model="action.selected"/>
						</div>
					</div>
				</div>
			</v-form>
			<div class="flex justify-center">
				<button class="btn green-primary" @click="submitSave">Сохранить</button>
			</div>
		</div>
	</div>
</template>

<script>
import {PermissionService} from '../../../services/permission.service';
import {RoleService} from '../../../services/role.service';

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			isLoading: false,
			allPermissions: [],
			roleObj: {
				title: '',
				code: '',
				permissionIds: []
			}
		};
	},
	created() {
		this.isLoading = true;
		this.getPermissionList();
	},
	methods: {
		async getPermissionList() {
			try {
				const res = await PermissionService.fetchAllPermissions();
				Object.entries(res.reduce((obj, el) => {
					obj[el.sidebar.id] = [...obj[el.sidebar.id] || [], el];
					return obj;
				}, {})).forEach((item) => {
					this.allPermissions.push({sidebarName: item[1][0].sidebar.title, permissions: item[1]});
				});
				this.isLoading = false;
				console.log(this.allPermissions);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async submitSave() {
			if (this.$refs.roleForm.validate()) {
				try {
					this.isLoading = true;
					this.allPermissions.forEach((sb) => {
						this.roleObj.permissionIds = [
							...this.roleObj.permissionIds,
							...sb.permissions.filter(i => i.selected).map(i => i.id)
						];
					});
					await RoleService.createRole(this.roleObj);
					this.isLoading = false;
					this.$toast.success('Роль успешно создана!');
					this.$router.push({name: 'roles'});
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
	.role-create {
		.create-role-content {
			background: #fff;
			padding: 20px;
			border-radius: 5px;
			max-width: 700px;
			margin: 15px auto 0;
			.permissions {
				.permission {
					border-bottom: 1px solid #D7E2ED;
					margin-bottom: 15px;
					padding-bottom: 15px;
					.access-field {
						display: flex;
						align-items: center;
						justify-content: space-between;
						max-width: 350px;
						height: 35px;
					}
				}
			}
		}
	}
</style>