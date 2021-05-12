import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const loadComponent = (path) => () => import(`@/views/${path}.vue`);

const routes = [
	{
		path: '/',
		name: 'login',
		component: loadComponent('login/Login'),
		meta: {
			requireAuth: false
		}
	},
	{
		path: '/user-manage',
		component: loadComponent('manage/UserManage'),
		children: [
			{
				path: '',
				name: 'dashboard',
				component: loadComponent('manage/Dashboard'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'applications',
				name: 'applications',
				component: loadComponent('manage/Application'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'department',
				name: 'department',
				component: loadComponent('manage/Department'),
				meta: {
					requireAuth: true
				}
			}
		]
	}

];

const router = new VueRouter({
	mode: 'history',
	routes
});

export default router;
