<template>
	<div class="approved-application-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<span>Одобренные заявки</span>
			<span></span>
		</div>

		<div class="tables d-flex">
			<table class="table fixed">
				<thead>
				<tr>
					<th>#</th>
					<th>Дата регистрации</th>
					<th>Филиал</th>
					<th>Программа</th>
					<th>ФИО</th>
					<th>Менеджер</th>
				</tr>
				</thead>
				<tbody>
				<tr
					v-for="(app, i) in allApplications" :key="app.id"
					@click="$router.push({name: 'appFullInfo', params: {id: app.id}})"
					class="link"
				>
					<td>{{(currentPage - 1) * 10 + (i + 1)}}</td>
					<td>{{app.registerDate}}</td>
					<td>{{app.departmentTitle}}</td>
					<td>{{app.programType}}</td>
					<td>
						{{app.customerResource.lastName+' '+app.customerResource.firstName+' '}}{{app.customerResource.middleName || ''}}
					</td>
					<td>{{app.userTitle}}</td>
				</tr>
				</tbody>
			</table>
			<table class="table is-scroll">
				<thead>
				<tr>
					<th>Пин клиента</th>
					<th>Регион</th>
					<th>Район</th>
					<th>Адрес</th>
					<th>Телефон</th>
					<th>Место работы</th>
					<th>Доход</th>
					<th>Предварит. стоимость(жилья/авто)</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="app in allApplications" :key="app.id">
					<td>{{app.customerResource.pin}}</td>
					<td>{{getRegionTitle(app.customerResource.regionId)}}</td>
					<td>{{app.customerResource.regionTitle}}</td>
					<td>{{app.customerResource.address}}</td>
					<td>{{app.customerResource.phoneNumber}}</td>
					<td>{{app.customerResource.jobPlace}}</td>
					<td>{{app.monthlyIncome}}</td>
					<td>{{app.proposedLoan}}</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div class="pagination d-flex align-center" v-if="totalPages.length > 1">
			<div class="select d-flex align-center">
				<label>Страница</label>
				<v-select
					solo
					class="drop-down-pages"
					:items="totalPages"
					v-model="currentPage"
					@change="jumpToPage"
				/>
			</div>
			<div class="divider">|</div>
			<div class="change-page d-flex align-center">
				<img src="../../assets/icons/arrow-right.svg" class="left" @click="paginate('left')">
				<span>{{currentPage}}</span>
				<img src="../../assets/icons/arrow-right.svg" @click="paginate('right')">
			</div>
		</div>
	</div>
</template>

<script>
import {ApplicationService} from '../../services/application.service';
import {RegionService} from '../../services/region.service';

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			isLoading: false,
			allApplications: [],
			allLocationList: [],
			currentPage: 1,
			totalPages: [],
			filterBody: {
				statuses: ['ISSUED', 'SAVING'],
				userId: ''
			}
		};
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
		},
		isShowAll() {
			return this.permissions.some(i => i.code === 'show-all-issued');
		}
	},
	async mounted() {
		this.filterBody.userId = this.isShowAll ? '' : this.userProfile.user.id;
		await this.getLocationList();
		this.getAllApplications();
	},
	methods: {
		async getAllApplications() {
			try {
				this.isLoading = true;
				const res = await ApplicationService.fetchApplicationList(this.currentPage, this.filterBody);
				this.allApplications = res._embedded ? res._embedded.applicationResourceList : [];
				this.totalPages = new Array(res.page.totalPages).fill(0).map((i, p) => p + 1);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getLocationList() {
			try {
				this.allLocationList = await RegionService.fetchAllLocationList();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		getRegionTitle(regionId) {
			if (regionId) {
				return this.allLocationList.find((item) => item.id === regionId).parentTitle;
			}
		},

		paginate(nav) {
			if (nav === 'right' && this.currentPage < this.totalPages.length) {
				this.currentPage += 1;
				this.getAllApplications();
			}
			if (nav === 'left' && this.currentPage > 1) {
				this.currentPage -= 1;
				this.getAllApplications();
			}
		},

		jumpToPage(page) {
			this.currentPage = page;
			this.getAllApplications();
		}
	}
};
</script>

<style lang="scss">
	.approved-application-container {
		.tables {
			flex-wrap: wrap;
			table {
				display: inline-block;
				overflow-x: auto;
				&::-webkit-scrollbar {
					width: 0;
					height: 8px;
					background: transparent;
				}
				&::-webkit-scrollbar-thumb {
					background-color: rgb(2 175 253 / 42%);
					border-radius: 5px;
				}
				th {
					white-space: nowrap;
				}
				td {
					padding: 0 10px;
					height: 70px;
				}
				&.fixed {
					width: 50%;
					border-radius: 5px 0 0 5px;
				}
				&.is-scroll {
					width: 50%;
					border-radius: 0 5px 5px 0;
				}
			}
			.link {
				cursor: pointer;
				&:hover {
					background: #3f51b51f;
				}
			}
		}
		.fixed-actions {
			display: flex;
			position: fixed;
			bottom: 0;
			background: #fff;
			padding: 10px 0;
			width: 100%;
			.btn:first-child {
				margin: 0 20px 0 15px;
			}
		}

		.pagination {
			background: #fff;
			justify-content: center;
			color: #778192;
			border-radius: 5px;
			margin-top: 20px;
			.select {
				.v-select {
					max-width: 77px;
					height: 50px;
				}
				.v-input__slot {
					box-shadow: none !important;
				}
			}
			.divider {
				margin: 0 25px 0 10px;
			}
			.change-page {
				img {
					transform: scale(2.2);
					cursor: pointer;
					&.left {
						transform: rotate(180deg) scale(2.2);
					}
				}
				span {
					color: #000;
					margin: 0 12px;
					font-size: 17px;
				}
			}
		}
	}
</style>