<template>
    <div class="arrival-expense-container">
        <div class="head-title d-flex align-center">
            <img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
            <span>Отчет Приход-Расход</span>
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
            <button class="btn blue-primary" @click="getArrivalExpenseReport">Фильтр</button>
        </div>

        <div class="d-flex justify-center">
            <table class="table" v-if="reportList.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Филиал</th>
                    <th>Статус</th>
                    <th>Программа</th>
                    <th>Кол-во</th>
                    <th>Вступительный</th>
                    <th>Собственный</th>
                    <th>Выдача</th>
                    <th>Бонусы</th>
                    <th>Предв.сто-сть</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in reportList" :key="i">
                    <td>{{i + 1}}</td>
                    <td>{{item.departmentTitle}}</td>
                    <td>{{statuses[item.statusType]}}</td>
                    <td>{{programType[item.programType]}}</td>
                    <td>{{item.totalCount}}</td>
                    <td>{{item.totalAdmissionFee}}</td>
                    <td>{{item.totalOwnContribution}}</td>
                    <td>{{countIssuance(item)}}</td>
                    <td>{{countBonus(item)}}</td>
                    <td>{{item.totalProposedCost}}</td>
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
			statuses: {
				'0': 'Очередь',
				'1': 'Отказ',
				'2': 'Выдано',
				'3': 'Накопительный',
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
		this.getArrivalExpenseReport();
	},
	methods: {
		async getArrivalExpenseReport() {
			try {
				this.isLoading = true;
				this.reportList = await ReportService.fetchArrivalExpense(this.startDate, this.endDate);
				this.isEmpty = !this.reportList.length;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		countIssuance(item) {
			return Number(item.totalOwnContribution) + Number(item.totalLoanAmount);
		},

		countBonus(item) {
			return (item.totalProposedCost * 0.005).toFixed(2);
		},

		async exportToExcel() {
			this.excelName = 'Отчет Приход-Расход';
			this.excelHeaders = [
				'Филиал',
				'Статус',
				'Программа',
				'Кол-во',
				'Вступительный',
				'Собственный',
				'Выдача',
				'Бонусы',
				'Предв.сто-сть'
			];
			this.excelRows = this.reportList.map((i) => {
				return [
					i.departmentTitle,
					this.statuses[i.statusType],
					this.programType[i.programType],
					i.totalCount,
					i.totalAdmissionFee,
					i.totalOwnContribution,
					this.countIssuance(i),
					this.countBonus(i),
					i.totalProposedCost
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
    .arrival-expense-container {
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