export const loginAction = (state: boolean) => {
	return (dispatch: any) => {
		dispatch({
			type: "login",
			payload: state,
		});
	};
};

export const logoutAction = (state: boolean) => {
	return (dispatch: any) => {
		dispatch({
			type: "logout",
			payload: state,
		});
	};
};
