import {API_BASE_URL, sendGetRequest, sendPostRequest} from './api.service';

export class RoleService {
	constructor() {}

	static fetchRoleById(id) {
		const url = `${API_BASE_URL}/security/role/${id}`;
		return sendGetRequest(url);
	}

	static createRole(body) {
		const url = `${API_BASE_URL}/security/role/create`;
		return sendPostRequest(url, body);
	}
}