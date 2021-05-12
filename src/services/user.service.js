import {API_BASE_URL, sendPostRequest} from './api.service';

export class UserService {
	constructor() {}

	static login(body) {
		const url = `${API_BASE_URL}/auth/login`;
		return sendPostRequest(url, body);
	}
}