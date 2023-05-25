import { Access } from "payload/config";

export const isAdminOrSelf = ({ req: { user } }) => {
	if (user) {
		if (user.roles?.includes("admin")) {
			return true;
		}
		return {
			id: {
				equals: user.id,
			},
		};
	}

	return false;
};

export const isAdminOrSelfFieldLevel = ({ req: { user } }) => {
	if (user) {
		if (user.roles?.includes("admin")) {
			return true;
		}
		return {
			id: {
				equals: user.id,
			},
		};
	}

	return false;
};
