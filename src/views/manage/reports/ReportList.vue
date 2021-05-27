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
			<tr>
				<td>1</td>
				<td><router-link :to="{name: 'programReport'}">Отчет по программам</router-link></td>
			</tr>
			<tr>
				<td>2</td>
				<td><router-link :to="{name: 'managerReport'}">Отчет по менеджерам</router-link></td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

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