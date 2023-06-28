const getUser = async () => {
	const result = await fetch("/api/users/me");
	const data = await result.json();
	return data.user;
};

export default getUser;
