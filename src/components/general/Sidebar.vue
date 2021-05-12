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
			}
		},
		async created() {
			try {
				this.sidebars = await SidebarService.fetchSidebarList();
			} catch (err) {
				this.$toast.error(err);
			}
		}
	}
</script>

<style lang="scss">
	.sidebar-container {
		min-width: 240px;
		min-height: 100vh;
		background: #233044;
		.sticky-block {
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
					svg {
						width: 20px;
						margin: 0 15px 0 30px;
					}
					&.router-link-exact-active {
						background: #1E293A;
						color: #fff;
						svg path {
							fill: #fff;
						}
					}
				}
			}
		}
	}
</style>