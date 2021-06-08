<template>
	<div class="sidebar-container">
		<div class="sticky-block">
			<div class="sidebar-logo">
				<img src="../../assets/images/inner-logo.svg">
			</div>
			<div class="tabs">
				<router-link v-for="item in sidebars" class="tab" :to="item.href" :key="item.id">
					<inline-svg :src="require('../../assets/icons/' + item.icon)"/>
					<span>{{item.title}}</span>
				</router-link>
				<router-link :to="{name: 'profile'}" class="tab">
					<img src="../../assets/icons/person.svg"/>
					<span>Профиль</span>
				</router-link>
				<div class="tab" @click="logout">
					<img src="../../assets/icons/logout.svg">
					<span>Выход</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';
import {SidebarService} from '../../services/sidebar.service';

export default {
	components: {
		InlineSvg
	},
	data() {
		return {
			sidebars: []
		};
	},
	async created() {
		try {
			const res = await SidebarService.fetchSidebarList();
			this.sidebars = res.sort((a, b) => a.order - b.order);
		} catch (err) {
			this.$toast.error(err);
		}
	},
	methods: {
		logout() {
			this.$modal.show('logout-modal');
		}
	},
};
</script>

<style lang="scss">
	.sidebar-container {
		min-width: 240px;
		min-height: 100vh;
		background: #233044;
		.sticky-block {
			position: sticky;
			top: 0;
			.sidebar-logo {
				height: 72px;
				line-height: 72px;
				text-align: center;
			}
			.tabs {
				margin-top: 10px;
				.tab {
					font-weight: 500;
					font-size: 15px;
					color: #EEEEEE;
					display: flex;
					align-items: center;
					padding: 13px 0;
					cursor: pointer;
					text-decoration: none;
					svg, img {
						width: 24px;
						margin: 0 15px 0 30px;
					}
					&.router-link-exact-active {
						background: #1E293A;
						color: #fff;
						svg path {
							/*fill: #fff;*/
						}
					}
				}
			}
		}
	}
</style>