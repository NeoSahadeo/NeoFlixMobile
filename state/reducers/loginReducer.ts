const reducer = (state = false, action: any) => {
	switch (action.type) {
		case "login":
			return state;
		case "logout":
			return state;
		default:
			return state;
	}
};

export default reducer;
