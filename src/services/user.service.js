import {API_BASE_URL, sendGetRequest, sendPostRequest} from './api.service';

export class UserService {
	constructor() {}

	static login(body) {
		const url = `${API_BASE_URL}/auth/login`;
		return sendPostRequest(url, body);
	}

	static createUser(body) {
		const url = `${API_BASE_URL}/user/create`;
		return sendPostRequest(url, body);
	}

	static updateUser(body) {
		const url = `${API_BASE_URL}/user/edit/${body.id}`;
		return sendPostRequest(url, body);
	}

	static makeUserArchive(userId) {
		const url = `${API_BASE_URL}/user/archive/${userId}`;
		return sendPostRequest(url, {});
	}

	static fetchUserList() {
		const url = `${API_BASE_URL}/user/list`;
		return sendGetRequest(url);
	}

	static fetchByDepartment(departId) {
		const url = `${API_BASE_URL}/user/list/department/${departId}`;
		return sendGetRequest(url);
	}

	static findById(userId) {
		const url = `${API_BASE_URL}/user/${userId}`;
		return sendGetRequest(url);
	}

	static fetchMyProfile() {
		const url = `${API_BASE_URL}/user/me`;
		return sendGetRequest(url);
	}
}