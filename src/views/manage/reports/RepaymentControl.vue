<template>
    <div class="repay-control-container">
        <div class="head-title d-flex align-center">
            <img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
            <span>Отчет Контроль-погашений</span>
        </div>

        <ExcelExport :headers="excelHeaders" :rows="excelRows" :fileName="excelName" ref="excel" class="d-flex justify-end">
            <template v-slot:excel>
                <button class="btn blue-primary" @click="exportToExcel" style="min-width: 170px">Экспортировать</button>
            </template>
        </ExcelExport>

        <div class="d-flex align-center justify-center">
            <div class="masked-input">
                <span>Дата от</span>
                <MaskedInput
                        mask="11.11.1111"
                        placeholder="ДД.ММ.ГГГГ"
                        v-model="startDate"
                />
            </div>
            <div class="masked-input date-to">
                <span>Дата до</span>
                <MaskedInput
                        mask="11.11.1111"
                        placeholder="ДД.ММ.ГГГГ"
                        v-model="endDate"
                />
            </div>
            <button class="btn blue-primary" @click="getRepayControlReport">Фильтр</button>
        </div>

        <div class="d-flex justify-center">
            <table class="table" v-if="reportList.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Филиал</th>
                    <th>Программа</th>
                    <th>Кол-во</th>
                    <th>План</th>
                    <th>Оплачено</th>
                    <th>Разница</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in reportList" :key="i">
                    <td>{{i + 1}}</td>
                    <td>{{item.departmentTitle}}</td>
                    <td>{{programType[item.programType]}}</td>
                    <td>{{item.totalCount}}</td>
                    <td>{{countPlan(item)}}</td>
                    <td>{{countPaid(item)}}</td>
                    <td>{{countPlan(item) - countPaid(item)}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-center" v-if="isEmpty">
            <h3>Пусто</h3>
        </div>
    </div>
</template>

<script>
import {ReportService} from '../../../services/report.service';
import {format} from 'date-fns';
import ExcelExport from '@/components/general/ExcelJs';

export default {
	components: {
		MaskedInput: () => import('vue-masked-input'),
		ExcelExport
	},
	data() {
		return {
			isLoading: false,
			reportList: [],
			startDate: '',
			endDate: '',
			isEmpty: false,
			programType: {
				'0': 'Авто',
				'1': 'Жилье'
			},
			excelHeaders: [],
			excelRows: [],
			excelName: ''
		};
	},
	created() {
		const date = new Date();
		this.startDate = format(date.setFullYear(date.getFullYear() - 1), 'dd.MM.yyyy');
		this.endDate = format(new Date(), 'dd.MM.yyyy');
		this.getRepayControlReport();
	},
	methods: {
		async getRepayControlReport() {
			try {
				this.isLoading = true;
				this.reportList = await ReportService.fetchRepaymentControl(this.startDate, this.endDate);
				this.isEmpty = !this.reportList.length;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		countPlan(item) {
			return (item.totalLoanTerm * item.totalPayment).toFixed(2);
		},

		countPaid(item) {
			return (item.totalLoanAmount - item.totalPaid).toFixed(2);
		},

		async exportToExcel() {
			this.excelName = 'Отчет Контроль-погашений';
			this.excelHeaders = [
				'Филиал',
				'Программа',
				'Кол-во',
				'План',
				'Оплачено',
				'Разница'
			];
			this.excelRows = this.reportList.map((i) => {
				return [
					i.departmentTitle,
					this.programType[i.programType],
					i.totalCount,
					this.countPlan(i),
					this.countPaid(i),
					this.countPlan(i) - this.countPaid(i)
				];
			});
			this.$nextTick(() => {
				this.$refs.excel.exportExcel();
			});
		}
	}
};
</script>

<style lang="scss">
    .repay-control-container {
        .masked-input {
            &.date-to {
                margin: 0 15px 0;
            }
            input {
                background: #fff;
            }
        }
        table.table {
            max-width: 100%;
            table-layout: auto;

            th, td {
                white-space: nowrap;
            }
        }
    }
</style>