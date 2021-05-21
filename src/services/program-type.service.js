import {API_BASE_URL, sendGetRequest} from './api.service';

export class ProgramTypeService {
	constructor() {}

	static fetchAllProgramTypes() {
		const url = `${API_BASE_URL}/reference/program/type/list`;
		return sendGetRequest(url);
	}
}