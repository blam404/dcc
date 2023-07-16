"use server";

import { cookies } from "next/headers";
import { getPayloadClient } from "~payload/payloadClient";

const handleLogin = async (email, password) => {
	const payload = await getPayloadClient();
	try {
		const result = await payload.login({
			collection: "users",
			data: {
				email,
				password,
			},
			depth: 0,
		});
		cookies().set({
			name: "payload-token",
			value: result.token,
			expires: new Date(result.exp * 1000),
			sameSite: "strict",
		});
		cookies().set({
			name: "payload-roles",
			value: result.user.roles,
			expires: new Date(result.exp * 1000),
			sameSite: "strict",
		});
		return { success: true, user: result.user };
	} catch (error) {
		return { error: error.message };
	}
};

export default handleLogin;
