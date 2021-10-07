<template>
	<div class="approved-application-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<span>Одобренные заявки</span>
			<ExcelExport :headers="excelHeaders" :rows="excelRows" :fileName="excelName" ref="excel">
				<template v-slot:excel>
					<button class="btn blue-primary" @click="exportToExcel" style="min-width: 170px">Экспортировать</button>
				</template>
			</ExcelExport>
		</div>

		<form class="d-flex justify-center search">
			<input type="text" placeholder="Найти по фио..." class="input-field" v-model="filterBody.userTitle">
			<button class="btn green-primary" @click.prevent="searchApp">Поиск</button>
		</form>

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
					<td><template v-if="totalPageCount > 1">{{(totalPageCount * 10) - (i + 1)}}</template></td>
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
					<td><span class="short-info">{{app.customerResource.address}}</span></td>
					<td>{{app.customerResource.phoneNumber}}</td>
					<td><span class="short-info">{{app.customerResource.jobPlace}}</span></td>
					<td>{{app.monthlyIncome}}</td>
					<td>{{app.proposedLoan}}</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div class="pagination d-flex align-center" v-if="totalPages.length > 1">
			<div class="change-page d-flex align-center">
				<span>Страница:</span>
				<span>{{currentPage +' '+ 'из' +' '+ totalPages.length}}</span>
			</div>
			<div class="divider">|</div>
			<div class="select d-flex align-center">
				<v-select
					solo
					class="drop-down-pages"
					:items="totalPages"
					v-model="currentPage"
					@change="jumpToPage"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import {ApplicationService} from '../../services/application.service';
import {RegionService} from '../../services/region.service';
import ExcelExport from '@/components/general/ExcelJs';

export default {
	components: {
		ExcelExport
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			isLoading: false,
			allApplications: [],
			allLocationList: [],
			currentPage: 1,
			totalPages: [],
			totalPageCount: 0,
			filterBody: {
				statuses: ['ISSUED', 'SAVING'],
				userId: '',
				userTitle: ''
			},
			excelHeaders: [],
			excelRows: [],
			excelName: ''
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
		// this.filterBody.userId = this.isShowAll ? '' : this.userProfile.user.id;
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
				this.totalPageCount = this.totalPages.length;
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

		async jumpToPage(page) {
			this.currentPage = page;
			await this.getAllApplications();
			this.totalPageCount = (this.totalPages.length - page) + 1;
		},

		async searchApp() {
			this.currentPage = 1;
			this.getAllApplications();
		},

		async exportToExcel() {
			try {
				this.isLoading = true;
				this.filterBody.userTitle = '';
				const res = await ApplicationService.fetchApplicationList(1, this.filterBody, this.totalPageCount * 10);
				this.allApplications = res._embedded ? res._embedded.applicationResourceList : [];
				this.excelName = 'Одобренные Заявки';
				this.excelHeaders = [
					'Дата регистрации',
					'Филиал',
					'Программа',
					'ФИО',
					'Менеджер',
					'Пин клиента',
					'Регион',
					'Район',
					'Адрес',
					'Телефон',
					'Место работы',
					'Доход',
					'Предв. стоимость(жилья/авто)'
				];
				this.excelRows = this.allApplications.map((i) => {
					return [
						i.registerDate,
						i.departmentTitle,
						i.programType,
						i.customerResource.lastName+' '+i.customerResource.firstName,
						i.userTitle,
						i.customerResource.pin,
						this.getRegionTitle(i.customerResource.regionId),
						i.customerResource.regionTitle,
						i.customerResource.address,
						i.customerResource.phoneNumber,
						i.customerResource.jobPlace,
						i.monthlyIncome,
						i.proposedLoan
					];
				});
				this.$nextTick(() => {
					this.$refs.excel.exportExcel();
					this.isLoading = false;
				});
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss">
	.approved-application-container {
		.search {
			margin-top: 25px;
			.input-field {
				margin-right: 10px;
				width: 25%;
			}
			.btn {
				max-width: 75px;
			}
		}
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
					.short-info {
						display: -webkit-box;
						max-height: 70px;
						overflow: hidden;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						text-overflow: ellipsis;
					}
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