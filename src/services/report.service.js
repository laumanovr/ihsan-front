import {API_BASE_URL, sendGetRequest} from './api.service';

export class ReportService {
	constructor() {}

	static generateByProgram(departId, startDate, endDate) {
		const url = `${API_BASE_URL}/statistic/program?departmentId=${departId}&startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static generateByManager(departId, startDate, endDate) {
		const url = `${API_BASE_URL}/statistic/manager?departmentId=${departId}&startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchGeneralAnalytics(departId, startDate, endDate) {
		const url = `${API_BASE_URL}/statistic/general?departmentId=${departId}&startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchPaymentStatistic(departId, startDate, endDate) {
		const url = `${API_BASE_URL}/application/payment/clients?departmentId=${departId}&startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	// REPORTS
	static fetchIssuedLoan(startDate, endDate) {
		const url = `${API_BASE_URL}/report/issued-loan?startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchQueueSavings(startDate, endDate) {
		const url = `${API_BASE_URL}/report/status-loan?startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchArrivalExpense(startDate, endDate) {
		const url = `${API_BASE_URL}/report/arrival-expense?startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchExpenseIssue(startDate, endDate) {
		const url = `${API_BASE_URL}/report/issue-expense?startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchRepaymentControl(startDate, endDate) {
		const url = `${API_BASE_URL}/report/repayment-loan?startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}

	static fetchAdmissionContribControl(startDate, endDate) {
		const url = `${API_BASE_URL}/report/queue-loan-contribution?startDate=${startDate}&endDate=${endDate}`;
		return sendGetRequest(url);
	}
}