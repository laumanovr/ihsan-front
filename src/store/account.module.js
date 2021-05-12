import {UserService} from '../services/user.service';
import router from '../router/index';

const user = JSON.parse(window.localStorage.getItem('ihsanUser'));

const state = {
	user: user || {},
	onError: '',
	onSuccess: ''
};

const actions = {
	async userLogin({commit, dispatch}, body) {
		try {
			const user = await UserService.login(body);
			window.localStorage.setItem('ihsanUser', JSON.stringify(user));
			commit('setUser', user);
			router.push('/user-manage');
		} catch (err) {
			commit('setError', err);
		}
	}
};

const mutations = {
	setUser(state, data) {
		state.user = data
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