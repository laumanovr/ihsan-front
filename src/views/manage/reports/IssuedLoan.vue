<template>
    <div class="issued-container">
        <div class="head-title d-flex align-center">
            <img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
            <span>Отчет по выдачи</span>
        </div>

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
            <button class="btn blue-primary" @click="getIssuedLoanReport">Фильтр</button>
        </div>

        <div class="d-flex justify-center">
            <table class="table" v-if="issuedLoans.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Филиал</th>
                    <th>Тип</th>
                    <th>
                        <div class="double">Выдано
                            <div>Кол-во | Сумма</div>
                        </div>
                    </th>
                    <th>
                        <div class="double">Текущий остаток
                            <div>Кол-во | Сумма</div>
                        </div>
                    </th>
                    <th>Доля</th>
                    <th>Сред.сумма кредита</th>
                    <th>Сред.стоимость</th>
                    <th>Ежемес.платеж</th>
                    <th>Ежемес.доход</th>
                    <th>Платеж/Доход(PTI)</th>
                    <th>Кредит стоимость жилья(LTV)</th>
                    <th>Общая площадь</th>
                    <th>Ст-ть м2</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in issuedLoans" :key="i">
                    <td>{{i + 1}}</td>
                    <td>{{item.departmentTitle}}</td>
                    <td>{{programType[item.programType]}}</td>
                    <td>
                        <div class="double-num"><span>{{item.totalCount}}</span><span>{{formatNum(item.totalLoanAmount)}}</span>
                        </div>
                    </td>
                    <td>
                        <div class="double-num"><span>{{item.totalCount}}</span><span>{{formatNum(item.totalSharePaymentAmount)}}</span>
                        </div>
                    </td>
                    <td>{{countSharePercent(item.totalCount)}}%</td>
                    <td>{{formatNum(item.avgLoanAmount)}}</td>
                    <td>{{formatNum(item.avgProposedCost)}}</td>
                    <td>{{formatNum(item.avgMonthlyPayment)}}</td>
                    <td>{{formatNum(item.avgMonthlyIncome)}}</td>
                    <td>{{countPti(item)}}%</td>
                    <td>{{countLtv(item)}}%</td>
                    <td>{{item.totalArea}}</td>
                    <td>{{countSquareMeter(item)}}</td>
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
import MaskedInput from 'vue-masked-input';
import {format} from 'date-fns';

export default {
	components: {
		MaskedInput
	},
	data() {
		return {
			isLoading: false,
			issuedLoans: [],
			startDate: '',
			endDate: '',
			isEmpty: false,
			programType: {
				'0': 'Авто',
				'1': 'Жилье'
			}
		};
	},
	created() {
		const date = new Date();
		this.startDate = format(date.setMonth(date.getMonth() - 3), 'dd.MM.yyyy');
		this.endDate = format(new Date(), 'dd.MM.yyyy');
	},
	methods: {
		async getIssuedLoanReport() {
			try {
				this.isLoading = true;
				this.issuedLoans = await ReportService.fetchIssuedLoan(this.startDate, this.endDate);
				this.isEmpty = !this.issuedLoans.length;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		formatNum(num) {
			return Number(num);
		},

		countSharePercent(currentLoanCount) {
			const totalIssuedLoans = this.issuedLoans.reduce((sum, li) => sum + li.totalCount, 0);
			return (currentLoanCount / totalIssuedLoans) * 100;
		},

		countPti(item) {
			return ((item.avgMonthlyPayment / item.avgMonthlyIncome) * 100).toFixed(1);
		},

		countLtv(item) {
			return ((item.avgLoanAmount / item.avgProposedCost) * 100).toFixed(1);
		},

		countSquareMeter(item) {
			if (item.totalArea) {
				return ((item.avgProposedCost / item.totalArea) * 100).toFixed(1);
			}
			return 0;
		}
	}
};
</script>

<style lang="scss">
    .issued-container {
        .masked-input {
            &.date-to {
                margin: 0 15px 0;
            }

            input {
                background: #fff;
            }
        }

        table.table {
            display: inline-block;
            overflow-x: auto;
            max-width: 80vw;

            th, td {
                white-space: nowrap;
            }

            .double-num {
                display: flex;
                justify-content: space-between;
                padding: 0 5px;
            }
        }
    }
</style>