<template>
    <div class="repay-control-container">
        <div class="head-title d-flex align-center">
            <img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
            <span>Отчет Контроль-взносов</span>
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
            <button class="btn blue-primary" @click="getAdmissionControlReport">Фильтр</button>
        </div>

        <div class="d-flex justify-center">
            <table class="table" v-if="reportList.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Филиал</th>
                    <th>Программа</th>
                    <th>
                        <div class="quad">
                            Вступит.взнос(3%, 4%, 5%, 7%)
                            <div class="d-flex justify-space-between">
                                <span>кол-во</span><span>план</span><span>оплачено</span><span>разница</span>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="quad">
                            Собственный вклад(25%, 35%, 50%)
                            <div class="d-flex justify-space-between">
                                <span>кол-во</span><span>план</span><span>оплачено</span><span>разница</span>
                            </div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in reportList" :key="i">
                    <td>{{i + 1}}</td>
                    <td>{{item.departmentTitle}}</td>
                    <td>{{programType[item.programType]}}</td>
                    <td>
                        <div class="d-flex justify-space-between quad">
                            <span>{{item.totalCount}}</span>
                            <span>{{countPlanAdmission(item)}}</span>
                            <span>{{item.totalAdmissionFee}}</span>
                            <span>{{(countPlanAdmission(item) - item.totalAdmissionFee).toFixed(2)}}</span>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex justify-space-between quad">
                            <span>{{item.totalCount}}</span>
                            <span>{{countPlanOwnContrib(item)}}</span>
                            <span>{{item.totalOwnContribution}}</span>
                            <span>{{(countPlanOwnContrib(item) - item.totalOwnContribution).toFixed(2)}}</span>
                        </div>
                    </td>
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
			reportList: [],
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
		this.startDate = format(date.setFullYear(date.getFullYear() - 1), 'dd.MM.yyyy');
		this.endDate = format(new Date(), 'dd.MM.yyyy');
		this.getAdmissionControlReport();
	},
	methods: {
		async getAdmissionControlReport() {
			try {
				this.isLoading = true;
				this.reportList = await ReportService.fetchAdmissionContribControl(this.startDate, this.endDate);
				this.isEmpty = !this.reportList.length;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		countPlanAdmission(item) {
			return (item.totalProposedCost * (item.programType ? 0.04 : 0.07)).toFixed(2);
		},

		countPlanOwnContrib(item) {
			return(item.totalProposedCost * (Number(item.programPercent) / 100)).toFixed(2);
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
            .quad span {
                width: 98px;
                &:first-child {
                    border-left: 1px solid;
                }
            }
        }
    }
</style>