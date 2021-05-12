import {API_BASE_URL, sendGetRequest, sendPostRequest} from './api.service';

export class DepartmentService {
	constructor() {}

	static createTerritory(body) {
		const url = `${API_BASE_URL}/reference/territory/create`;
		return sendPostRequest(url, body);
	}

	static updateTerritory(body) {
		const url = `${API_BASE_URL}/reference/territory/edit/${body.id}`;
		return sendPostRequest(url, body);
	}

	static fetchTerritoryList() {
		const url = `${API_BASE_URL}/reference/territory/list`;
		return sendGetRequest(url);
	}
	// ---------------------------------------------------------------------
	static createDepartment(body) {
		const url = `${API_BASE_URL}/reference/department/create`;
		return sendPostRequest(url, body);
	}

	static updateDepartment(body) {
		const url = `${API_BASE_URL}/reference/department/edit/${body.id}`;
		return sendPostRequest(url, body);
	}

	static fetchDepartmentList() {
		const url = `${API_BASE_URL}/reference/department/list`;
		return sendGetRequest(url);
	}
}