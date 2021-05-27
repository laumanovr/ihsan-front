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
				path: 'approved-apps',
				name: 'approvedApps',
				component: loadComponent('manage/ApprovedApps'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'reports',
				name: 'reports',
				component: loadComponent('manage/reports/ReportList'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'program-report',
				name: 'programReport',
				component: loadComponent('manage/reports/ProgramReport'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'manager-report',
				name: 'managerReport',
				component: loadComponent('manage/reports/ManagerReport'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'approved-apps/:id/full-info',
				name: 'appFullInfo',
				component: loadComponent('manage/AppFullInfo')
			},
			{
				path: 'department',
				name: 'department',
				component: loadComponent('manage/Department'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'roles',
				name: 'roles',
				component: loadComponent('manage/role/Role'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'role-create',
				name: 'roleCreate',
				component: loadComponent('manage/role/RoleCreate'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'role-edit/:id',
				name: 'roleEdit',
				component: loadComponent('manage/role/RoleEdit'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'users',
				name: 'users',
				component: loadComponent('manage/Users'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'profile',
				name: 'profile',
				component: loadComponent('manage/Profile'),
				meta: {
					requireAuth: true
				}
			},
		]
	}

];

const router = new VueRouter({
	mode: 'history',
	routes
});

router.beforeEach((to, from, next) => {
	const loggedIn = window.localStorage.getItem('ihsanUser');
	if (to.meta.requireAuth && !loggedIn) {
		return next('/');
	}
	next();
});

export default router;
