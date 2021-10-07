<template>
    <div>
        <slot name="excel"></slot>
    </div>
</template>

<script>
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
export default {
	props: {
		headers: Array,
		rows: Array,
		fileName: String
	},
	methods: {
		exportExcel(e, sheetName = 'Sheet') {
			const workbook = new ExcelJS.Workbook();
			workbook.creator = 'Ihsan Team';
			workbook.created = new Date();
			workbook.modified = new Date();
			workbook.lastPrinted = new Date();
			const worksheet = workbook.addWorksheet(`${sheetName}`, {
				pageSetup: {paperSize: 9, orientation: 'landscape'}
			});
			const bodyBorder = {
				top: {style: 'thin'},
				left: {style: 'thin'},
				bottom: {style: 'thin'},
				right: {style: 'thin'}
			};
			const bodyFont = {size: 12};
			const bodyAlignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
			worksheet.addRow(this.headers);
			worksheet.getRow(1).font = {size: 12, bold: true};
			worksheet.getRow(1).alignment = bodyAlignment;
			worksheet.getRow(1).height = 38;
			worksheet.getRow(1).eachCell({includeEmpty: true}, cell => {
				cell.border = bodyBorder;
			});
			worksheet.addRows(this.rows);
			this.headers.forEach((i, index) => {
				worksheet.getColumn(index + 1).width = 25;
			});
			worksheet.eachRow({includeEmpty: true}, (row, rowNumber) => {
				if (rowNumber > 1) {
					row.eachCell({includeEmpty: true}, (cell) => {
						cell.border = bodyBorder;
						cell.font = bodyFont;
						cell.alignment = bodyAlignment;
					});
				}
			});
			workbook.xlsx.writeBuffer().then((data) => {
				let blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
				saveAs(blob, `${this.fileName}.xlsx`);
			});
		}
	}
};
</script>