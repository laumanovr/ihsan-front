import {API_BASE_URL, sendGetRequest} from './api.service';

export class PermissionService {
	constructor() {}

	static fetchAllPermissions() {
		const url = `${API_BASE_URL}/security/permission/list`;
		return sendGetRequest(url);
	}
}