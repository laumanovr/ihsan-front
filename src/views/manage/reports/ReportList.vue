<template>
	<div class="report-container">
		<div class="head-title">Отчеты</div>

		<table class="table">
			<thead>
			<tr>
				<th>#</th>
				<th>Название</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(report, i) in reportList" :key="i">
				<td>{{i + 1}}</td>
				<td><router-link :to="{name: report.link}">{{report.title}}</router-link></td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			reportList: [
				{title: 'Отчет по программам', link: 'programReport'},
				{title: 'Отчет по менеджерам', link: 'managerReport'},
				{title: 'Отчет по Выдачи', link: 'issuedLoan'},
				{title: 'Отчет Очередь-накопительное', link: 'queueSaving'},
				{title: 'Отчет Приход-расход', link: 'arrivalExpense'},
				{title: 'Отчет Расход-выдачи', link: 'expenseIssue'},
				{title: 'Отчет Контроль-погашений', link: 'repaymentControl'},
				{title: 'Отчет Контроль-взносов', link: 'admissionControl'}
			]
		};
	}
};
</script>

<style lang="scss">
	.report-container {
		.table {
			table-layout: auto;
			th, td {
				text-align: left;
				padding-left: 25px;
			}
		}
	}
</style>