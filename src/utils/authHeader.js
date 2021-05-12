export const authHeader = () => {
	const user = JSON.parse(window.localStorage.getItem('ihsanUser'));
	if (user && user.token) {
		return {Authorization: `Bearer_${user.token}`};
	}
	return {};
};
