<template>
    <div class="queue-saving-container">
        <div class="head-title d-flex align-center">
            <img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
            <span>Отчет Очередь-Накопительное</span>
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
            <button class="btn blue-primary" @click="getQueueSavingReport">Фильтр</button>
        </div>

        <div class="d-flex justify-center">
            <table class="table" v-if="queueSavings.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Филиал</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>
                        <div class="double">Предв.ст-ть жилья
                            <div>Кол-во | Сумма</div>
                        </div>
                    </th>
                    <th>Доля</th>
                    <th>Сред.сумма кредита</th>
                    <th>Необходимая сумма</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in queueSavings" :key="i">
                    <td>{{i + 1}}</td>
                    <td>{{item.departmentTitle}}</td>
                    <td>{{programType[item.programType]}}</td>
                    <td>{{statuses[item.statusType]}}</td>
                    <td>
                        <div class="double-num">
                            <span>{{item.totalCount}}</span><span>{{formatNum(item.avgProposedCost).toFixed(2)}}</span>
                        </div>
                    </td>
                    <td>{{countSharePercent(item.totalCount)}}%</td>
                    <td>{{countAvgLoanSum(item)}}</td>
                    <td>{{countNeededSum(item)}}</td>
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

export default {
	components: {
		MaskedInput: () => import('vue-masked-input')
	},
	data() {
		return {
			isLoading: false,
			queueSavings: [],
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
			}
		};
	},
	created() {
		const date = new Date();
		this.startDate = format(date.setMonth(date.getMonth() - 3), 'dd.MM.yyyy');
		this.endDate = format(new Date(), 'dd.MM.yyyy');
	},
	methods: {
		async getQueueSavingReport() {
			try {
				this.isLoading = true;
				this.queueSavings = await ReportService.fetchQueueSavings(this.startDate, this.endDate);
				this.isEmpty = !this.queueSavings.length;
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
			const totalIssuedLoans = this.queueSavings.reduce((sum, li) => sum + li.totalCount, 0);
			return (currentLoanCount / totalIssuedLoans) * 100;
		},

		countAvgLoanSum(item) {
			return (item.avgProposedCost - item.avgOwnContribution).toFixed(1);
		},

		countNeededSum(item) {
			return (item.totalCount * this.countAvgLoanSum(item)).toFixed(1);
		}
	}
};
</script>

<style lang="scss">
    .queue-saving-container {
        .masked-input {
            &.date-to {
                margin: 0 15px 0;
            }
            input {
                background: #fff;
            }
        }
        table.table {
            table-layout: auto;
            .double-num {
                display: flex;
                justify-content: space-around;
                span:first-child {
                    padding-left: 10px;
                }
            }
        }
    }
</style>