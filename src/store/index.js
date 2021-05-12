import Vue from 'vue';
import Vuex from 'vuex';
import {account} from './account.module';
import {role} from './role.module';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		account,
		role
	}
});
