import {API_BASE_URL, sendGetRequest, sendPostRequest} from './api.service';

export class ApplicationService {
	constructor() {}

	static fetchApplicationList(page, body) {
		const url = `${API_BASE_URL}/application/list?page=${page - 1}`;
		return sendPostRequest(url, body);
	}

	static create(body) {
		const url = `${API_BASE_URL}/application/create`;
		return sendPostRequest(url, body);
	}

	static update(body) {
		const url = `${API_BASE_URL}/application/edit/${body.id}`;
		return sendPostRequest(url, body);
	}

	static findById(appId) {
		const url = `${API_BASE_URL}/application/${appId}`;
		return sendGetRequest(url);
	}

	static fetchAppEstateInfo(appId) {
		const url = `${API_BASE_URL}/application/information/application/${appId}`;
		return sendGetRequest(url);
	}

	static createAppEstateInfo(body) {
		const url = `${API_BASE_URL}/application/information/create`;
		return sendPostRequest(url, body);
	}

	static updateAppEstateInfo(body) {
		const url = `${API_BASE_URL}/application/information/edit/${body.id}`;
		return sendPostRequest(url, body);
	}

	static makeApproved(body) {
		const url = `${API_BASE_URL}/application/process`;
		return sendPostRequest(url, body);
	}
}