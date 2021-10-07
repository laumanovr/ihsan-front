import {API_BASE_URL, sendGetRequest, sendPostRequest, sendDeleteRequest} from './api.service';
import {authHeader} from '../utils/authHeader';
import axios from 'axios';

export class ApplicationService {
	constructor() {}

	static fetchApplicationList(page, body, size=10) {
		const url = `${API_BASE_URL}/application/list?page=${page - 1}&size=${size}`;
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

	static attachFile(appId, formData) {
		const url = `${API_BASE_URL}/application/${appId}/attachment`;
		return sendPostRequest(url, formData);
	}

	static deleteFile(id) {
		const url = `${API_BASE_URL}/application/attachment?id=${id}`;
		return sendDeleteRequest(url, {});
	}

	static downloadFile(fileUrl) {
		const url = `${API_BASE_URL}/file/downloadFile/${fileUrl}`;
		const config = {method: 'GET', url, headers: {...authHeader()}, responseType: 'blob'};
		return axios(config).then((res) => res.data);
	}

	static paymentCreate(body) {
		const url = `${API_BASE_URL}/application/payment/create/batch`;
		return sendPostRequest(url, body);
	}

	static fetchPaymentInfo(appId) {
		const url = `${API_BASE_URL}/application/payment/application/${appId}`;
		return sendGetRequest(url);
	}

	static importApplication(body) {
		const url = `${API_BASE_URL}/file/application/import`;
		return sendPostRequest(url, body);
	}

	static removeApp(id) {
		const url = `${API_BASE_URL}/application/?id=${id}`;
		return sendDeleteRequest(url, {});
	}
}