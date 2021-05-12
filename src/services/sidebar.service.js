import {API_BASE_URL, sendGetRequest} from './api.service';

export class SidebarService {
	constructor() {}

	static fetchSidebarList() {
		const url = `${API_BASE_URL}/security/sidebar`;
		return sendGetRequest(url);
	}
}