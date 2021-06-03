<template>
	<div class="dashboard-container">
		<PreLoader v-if="isLoading"/>

		<v-form ref="filterForm" class="d-flex justify-center filter">
			<v-select
				outlined
				class="select-short"
				label="Филиал"
				:items="departments"
				item-text="title"
				item-value="id"
				v-model="filterObj.departmentId"
				:rules="requiredRule"
			/>
			<v-menu
				:close-on-content-click="true"
				:nudge-right="40"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
						class="select-short"
						label="Дата от"
						readonly
						outlined
						v-bind="attrs"
						v-on="on"
						v-model="filterObj.startDate"
						:rules="requiredRule"
					/>
				</template>
				<v-date-picker
					locale="ru-RU"
					v-model="pickerStart"
					@input="onSelectDate('pickerStart', 'startDate')"
				/>
			</v-menu>
			<v-menu
				:close-on-content-click="true"
				:nudge-right="40"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
						class="select-short"
						label="Дата до"
						readonly
						outlined
						v-bind="attrs"
						v-on="on"
						v-model="filterObj.endDate"
						:rules="requiredRule"
					/>
				</template>
				<v-date-picker
					locale="ru-RU"
					v-model="pickerEnd"
					@input="onSelectDate('pickerEnd', 'endDate')"
				/>
			</v-menu>
			<button class="btn blue-primary" @click.prevent="generateAnalytics">Сгенерировать</button>
		</v-form>

		<div class="d-flex justify-space-between">
			<div class="card">
				<div class="label">Кол-во заявок</div>
				<div class="count">{{analyticObj.total}}</div>
			</div>
			<div class="card">
				<div class="label">Выдано квартир/дом/авто</div>
				<div class="count">{{analyticObj.totalIssued}}</div>
			</div>
			<div class="card">
				<div class="label">Сумма Выдачи</div>
				<div class="count">{{formatSum(analyticObj.totalSum)}} с</div>
			</div>
			<div class="card">
				<div class="label">Поступит</div>
				<div class="count">{{formatSum(amountReceive)}} с</div>
			</div>
		</div>

		<div class="tables d-flex justify-space-between align-start">
			<div style="margin-right: 15px;">
				<h3>Ожидание оплаты</h3>
				<table class="table">
					<thead>
					<tr>
						<th class="num">#</th>
						<th>ФИО</th>
						<th>Дата</th>
						<th>Оплата</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(client, i) in paymentStatistics" :key="client.id">
						<td class="num">{{i + 1}}</td>
						<td>{{client.accountantTitle}}</td>
						<td>{{formatDate(client.paymentDate)}}</td>
						<td>{{formatSum(client.paymentAmount)}} с</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h3>Менеджеры</h3>
				<table class="table">
					<thead>
					<tr>
						<th class="num">#</th>
						<th>ФИО</th>
						<th>Договоры</th>
						<th>На сумму</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, i) in managerStatistic" :key="i">
						<td class="num">{{i + 1}}</td>
						<td>{{item.managerTitle}}</td>
						<td>{{item.totalDeal}}</td>
						<td>{{formatSum(item.totalSum)}} с</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>

	</div>
</template>

<script>
import {ReportService} from '../../services/report.service';
import {DepartmentService} from '../../services/department.service';
import {format} from 'date-fns';

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			isLoading: false,
			departments: [],
			filterObj: {
				departmentId: '',
				startDate: '',
				endDate: format(new Date(), 'dd.MM.yyyy')
			},
			pickerStart: '',
			pickerEnd: format(new Date(), 'yyyy-MM-dd'),
			analyticObj: {},
			amountReceive: 0,
			paymentStatistics: [],
			managerStatistic: []
		};
	},
	created() {
		this.getDepartments();
		const date = new Date();
		this.pickerStart = format(date.setMonth(date.getMonth() - 3), 'yyyy-MM-dd');
		this.filterObj.startDate = new Date(this.pickerStart).toLocaleDateString('ru');
	},
	methods: {
		onSelectDate(pickerField, inputField) {
			this.filterObj[inputField] = new Date(this[pickerField]).toLocaleDateString('ru');
		},

		formatSum(sum) {
			return sum ? Number(sum).toLocaleString('en-EN') : 0;
		},

		formatDate(date) {
			return format(new Date(date), 'dd.MM.yyyy');
		},

		async getDepartments() {
			try {
				this.departments = await DepartmentService.fetchDepartmentList();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async generateAnalytics() {
			try {
				this.isLoading = true;
				const res = await ReportService.fetchGeneralAnalytics(this.filterObj.departmentId, this.filterObj.startDate, this.filterObj.endDate);
				this.analyticObj = res[0];
				await this.fetchPaymentStatistic();
				this.fetchManagerStatistic();
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async fetchPaymentStatistic() {
			try {
				this.amountReceive = 0;
				this.paymentStatistics = await ReportService.fetchPaymentStatistic(this.filterObj.departmentId, this.filterObj.startDate, this.filterObj.endDate);
				this.paymentStatistics.forEach((i) => this.amountReceive += i.paymentAmount);
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async fetchManagerStatistic() {
			try {
				this.managerStatistic = [];
				const res = await ReportService.generateByManager(this.filterObj.departmentId, this.filterObj.startDate, this.filterObj.endDate);
				Object.entries(res.reduce((obj, el) => {
					obj[el.managerTitle] = [...obj[el.managerTitle] || [], el];
					return obj;
				}, {})).forEach((item) => {
					let totalSum = 0;
					item[1].map(i => totalSum += i.totalLoanAmount);
					this.managerStatistic.push({managerTitle: item[0], totalDeal: item[1].length, totalSum: totalSum});
				});
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
			}
		}
	}
};
</script>

<style lang="scss">
	.dashboard-container {
		.filter {
			background: #fff;
			padding: 20px 20px 0;
			margin: 20px 0 16px 0;
			border-radius: 5px;
			.btn {
				height: 50px;
			}
		}
		.card {
			background: #fff;
			border-radius: 5px;
			min-width: 200px;
			width: calc(25% - 15px);
			padding: 16px;
			&:not(:last-child) {
				margin-right: 15px;
			}
			.label {
				font-size: 14px;
			}
			.count {
				font-size: 28px;
				font-weight: 500;
			}
		}

		.tables {
			margin-top: 20px;
			div {
				background: #fff;
				border-radius: 5px;
				h3 {
					margin: 10px 0 0;
				}
			}
			table {
				border-top: 0;
				border-left: 0;
				border-right: 0;
			}
			.num {
				width: 50px;
				max-width: 50px;
			}
		}
	}
</style>