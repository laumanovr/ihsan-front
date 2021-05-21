<template>
	<div class="role-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<span>Роли</span>
			<button class="btn blue-primary" v-if="permissions.some(i => i.code === 'role-create')">
				<router-link :to="{name: 'roleCreate'}">
					Добавить роль
				</router-link>
			</button>
		</div>

		<table class="table">
			<thead>
			<tr>
				<th>Название</th>
				<th>Описание</th>
				<th></th>
				<th></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="role in roleList" :key="role.id">
				<td>{{role.title}}</td>
				<td>{{role.code}}</td>
				<td></td>
				<td>
					<router-link
						:to="{name: 'roleEdit', params: {id: role.id}}"
						v-if="permissions.some(i => i.code === 'role-edit')"
					>
						<img src="../../../assets/icons/edit-icon.svg">
					</router-link>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import {RoleService} from '../../../services/role.service';

	export default {
		data() {
			return {
				isLoading: false,
				roleList: []
			}
		},
		created() {
			this.isLoading = true;
			this.getRoleList();
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
		methods: {
			async getRoleList() {
				try {
					const res = await RoleService.fetchAllRoles();
					this.roleList = res.filter((role) => role.code !== 'ROLE_SUPER_ADMIN');
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		}
	}
</script>