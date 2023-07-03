"use server";

import { getPayloadClient } from "../../../../payload/payloadClient";

const handleLogin = async (
	{ characterName, bankAccount, phoneNumber, discord, timezone },
	user
) => {
	const payload = await getPayloadClient();
	try {
		const result = await payload.update({
			collection: "users",
			id: user.id,
			data: {
				characterName,
				bankAccount,
				phoneNumber,
				discord,
				timezone,
			},
			depth: 0,
			user,
			overrideAccess: false,
		});
		return { success: true, user: result };
	} catch (error) {
		return { error: error.message };
	}
};

export default handleLogin;
