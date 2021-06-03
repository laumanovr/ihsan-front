<template>
	<div class="program-report-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center">
			<img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
			<span>Отчет программы</span>
		</div>

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
			<button class="btn blue-primary" @click.prevent="generateReport">Сгенерировать</button>
		</v-form>

		<table class="table">
			<thead>
			<tr>
				<th>#</th>
				<th>Статус</th>
				<th>Программа</th>
				<th>Предполаг. займы</th>
				<th>Сумма займа</th>
				<th>Комиссия</th>
				<th>Собственный взнос</th>
				<th>Членский взнос</th>
				<th>Паевый взнос</th>
				<th>Всего платежей</th>
				<th>Стоимость жилья</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(report, i) in reportData" :key="i">
				<td>{{i + 1}}</td>
				<td>{{statuses[report.status]}}</td>
				<td>{{report.programTitle}}</td>
				<td>{{formatSum(report.totalProposedLoan)}}</td>
				<td>{{formatSum(report.totalLoanAmount)}}</td>
				<td>{{formatSum(report.totalAdmissionFee)}}</td>
				<td>{{formatSum(report.totalOwnContribution)}}</td>
				<td>{{formatSum(report.totalMembershipFee)}}</td>
				<td>{{formatSum(report.totalSharePayment)}}</td>
				<td>{{formatSum(report.totalPayment)}}</td>
				<td>{{formatSum(report.totalHouseCost)}}</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import {DepartmentService} from '../../../services/department.service';
import {ReportService} from '../../../services/report.service';
import {format} from 'date-fns';

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			statuses: {
				'0': 'Очередь',
				'1': 'Отказ',
				'2': 'Выдано',
				'3': 'Накопительный',
			},
			isLoading: false,
			departments: [],
			filterObj: {
				departmentId: '',
				startDate: '',
				endDate: format(new Date(), 'dd.MM.yyyy')
			},
			pickerStart: '',
			pickerEnd: format(new Date(), 'yyyy-MM-dd'),
			reportData: []
		};
	},
	created() {
		this.getDepartments();
		const date = new Date();
		this.pickerStart = format(date.setMonth(date.getMonth() - 3), 'yyyy-MM-dd');
		this.filterObj.startDate = new Date(this.pickerStart).toLocaleDateString('ru');
	},
	methods: {
		async getDepartments() {
			try {
				this.departments = await DepartmentService.fetchDepartmentList();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		onSelectDate(pickerField, inputField) {
			this.filterObj[inputField] = new Date(this[pickerField]).toLocaleDateString('ru');
		},

		formatSum(sum) {
			return sum ? Number(sum).toLocaleString('en-EN') : 0;
		},

		async generateReport() {
			if (this.$refs.filterForm.validate()) {
				try {
					this.isLoading = true;
					const res = await ReportService.generateByProgram(
						this.filterObj.departmentId,
						this.filterObj.startDate,
						this.filterObj.endDate
					);
					this.reportData = res.sort((a, b) => a.status - b.status);
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		}
	}
};
</script>

<style lang="scss">
	.program-report-container {
		.filter {
			background: #fff;
			padding: 20px 20px 0;
			margin-top: 20px;
			border-radius: 5px;
			.btn {
				height: 50px;
			}
		}
	}
</style>