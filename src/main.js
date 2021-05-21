import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VModal from 'vue-js-modal';
import VueToast from 'vue-toast-notification';
import PreLoader from '@/components/general/PreLoader';
import '@/assets/style/main.scss';

Vue.config.productionTip = false;
Vue.use(VueToast, {position: 'top', duration: 2500});
Vue.use(VModal);
Vue.component('PreLoader', PreLoader);

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');
