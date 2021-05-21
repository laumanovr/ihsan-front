import {API_BASE_URL, sendGetRequest} from './api.service';

export class RegionService {
	constructor() {}

	static fetchRegionList() {
		const url = `${API_BASE_URL}/location/list/parent/1`;
		return sendGetRequest(url);
	}

	static fetchDistrictList(regionId) {
		const url = `${API_BASE_URL}/location/list/parent/${regionId}`;
		return sendGetRequest(url);
	}

	static findById(id) {
		const url = `${API_BASE_URL}/location/${id}`;
		return sendGetRequest(url);
	}
}