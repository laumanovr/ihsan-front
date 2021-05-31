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
}