import {UserService} from '../services/user.service';
import {RoleService} from '../services/role.service';
import router from '../router/index';

const user = JSON.parse(window.localStorage.getItem('ihsanUser'));

const state = {
	user: user || {},
	onError: ''
};

const actions = {
	async userLogin({commit, dispatch}, body) {
		try {
			const user = await UserService.login(body);
			window.localStorage.setItem('ihsanUser', JSON.stringify(user));
			dispatch('getUserPermissions', user.roles[0].id);
		} catch (err) {
			commit('setError', err);
		}
	},
	async getUserPermissions({commit}, roleId) {
		try {
			const res = await RoleService.fetchRoleById(roleId);
			const user = JSON.parse(window.localStorage.getItem('ihsanUser'));
			user.permissions = res.permissions;
			user.roleTitle = res.title;
			commit('setUser', user);
			window.localStorage.setItem('ihsanUser', JSON.stringify(user));
			router.push('/user-manage');
		} catch (err) {
			commit('setError', err);
		}
	}
};

const mutations = {
	setUser(state, data) {
		state.user = data;
	},
	setError(state, err) {
		state.onError = err;
	}
};

export const account = {
	namespaced: true,
	state,
	actions,
	mutations,
};